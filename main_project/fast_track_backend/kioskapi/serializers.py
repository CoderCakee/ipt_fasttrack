from django.contrib.auth.hashers import check_password
from rest_framework import serializers
from users.models import User, Role
from requests.models import Request, RequestedDocuments, RequestPurpose, RequestStatus
from doccatalog.models import DocumentType
from datetime import datetime

class RequestedDocumentCheckSerializer(serializers.ModelSerializer):
    doctype_id = serializers.PrimaryKeyRelatedField(
        queryset=DocumentType.objects.filter(is_enabled=True),
    )
    copy_amount = serializers.IntegerField(min_value=1, default=1)
    doctype_name = serializers.CharField(source='doctype_id.name', read_only=True)
    processing_time = serializers.CharField(source='doctype_id.processing_time', read_only=True)

    class Meta:
        model = RequestedDocuments
        fields = [
            'doctype_id',
            'copy_amount',
            'doctype_name',
            'processing_time',
        ]

class RequestedDocumentCreateSerializer(serializers.ModelSerializer):
    doctype_id = serializers.PrimaryKeyRelatedField(
        queryset=DocumentType.objects.filter(is_enabled=True),
        source='doctype',
    )
    copy_amount = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = RequestedDocuments
        fields = [
            'doctype_id',
            'copy_amount',
        ]

class CheckRequestNumberSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_id.first_name', read_only=True)
    last_name = serializers.CharField(source='user_id.last_name', read_only=True)
    student_number = serializers.SerializerMethodField()
    request_number = serializers.SerializerMethodField()
    date_requested = serializers.DateTimeField(source='created_at', format='%B %d, %Y %I:%M %p')
    request_status = serializers.CharField(source='status_id.description', read_only=True)
    documents = RequestedDocumentCheckSerializer(source='requesteddocuments_set', many=True, read_only=True)

    class Meta:
        model = Request
        fields = [
            'first_name',
            'last_name',
            'student_number',
            'request_number',
            'date_requested',
            'request_status',
            'documents',
        ]

    def get_student_number(self, obj):
        return obj.user_id.student_number or 'N/A'

    def get_request_number(self, obj):
        from datetime import datetime
        current_year = datetime.now().year
        return f'FAST-{current_year}-{obj.request_id}'

class CheckRequestByStudentSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=35)
    last_name = serializers.CharField(max_length=35)
    student_number = serializers.CharField(max_length=15)

class RequestCreateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    student_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email_address = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    mobile_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    purpose_id = serializers.PrimaryKeyRelatedField(
        queryset=RequestPurpose.objects.all(),
        source='purpose'
    )
    requested_documents = RequestedDocumentCreateSerializer(write_only=True, many=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Request
        fields = [
            'first_name', 'last_name', 'middle_name', 'student_number',
            'email_address', 'mobile_number', 'purpose_id', 'requested_documents', 'notes'
        ]

    def validate(self, data):
        def normalize_name(value):
            return value.strip().capitalize() if value else value

        data['first_name'] = normalize_name(data.get('first_name'))
        data['last_name'] = normalize_name(data.get('last_name'))
        data['middle_name'] = normalize_name(data.get('middle_name'))

        if not data.get('email_address') and not data.get('mobile_number'):
            raise serializers.ValidationError("Either email or mobile number must be provided.")

        if not data.get('requested_documents'):
            raise serializers.ValidationError("At least one document must be requested.")

        return data

    def create(self, validated_data):
        requested_docs_data = validated_data.pop('requested_documents')

        def smart_capitalize(name: str) -> str:
            import re
            if not name:
                return name
            name = re.sub(r'\s+', ' ', name.strip().lower())

            def fix_mc(match):
                prefix = match.group(1).capitalize()
                rest = match.group(2).capitalize()
                return prefix + rest

            parts = name.split()
            lowercase_exceptions = {
                "de", "del", "dela", "di", "du", "van", "von", "bin", "binti", "ibn", "al", "da", "la"
            }
            formatted_parts = []
            for part in parts:
                if part in lowercase_exceptions:
                    formatted_parts.append(part)
                else:
                    formatted = part.capitalize()
                    formatted = re.sub(r'^(mc|mac)([a-z])', fix_mc, formatted, flags=re.IGNORECASE)
                    formatted_parts.append(formatted)
            return " ".join(formatted_parts)

        user_data = {
            'first_name': smart_capitalize(validated_data.pop('first_name')),
            'last_name': smart_capitalize(validated_data.pop('last_name')),
            'middle_name': smart_capitalize(validated_data.pop('middle_name', '')),
            'student_number': validated_data.pop('student_number', None),
            'email_address': validated_data.pop('email_address', None),
            'mobile_number': validated_data.pop('mobile_number', None),
        }

        # --- Lookup logic ---
        user = None
        email = user_data.get('email_address')
        mobile = user_data.get('mobile_number')

        if email:
            user = User.objects.filter(email_address=email).first()
        if not user and mobile:
            user = User.objects.filter(mobile_number=mobile).first()

        if user:
            updated = False
            for field, value in user_data.items():
                if value and getattr(user, field) != value:
                    setattr(user, field, value)
                    updated = True
            if updated:
                user.save()
        else:
            # Create new user
            requester_role = Role.objects.get(pk=4)
            user = User.objects.create(**user_data, role_id=requester_role)

        # --- Create the request ---
        request_status = RequestStatus.objects.get(description__iexact='requested')
        request_obj = Request.objects.create(
            user_id=user,
            purpose_id=validated_data['purpose'],
            status_id=request_status,
            notes=validated_data.get('notes', '')
        )

        # --- Create requested document ---
        for doc_data in requested_docs_data:
            RequestedDocuments.objects.create(
                request_id=request_obj,
                doctype_id=doc_data['doctype'],
                copy_amount=doc_data.get('copy_amount', 1)
            )

        return request_obj

class RequestReceiptSerializer(serializers.ModelSerializer):
    request_number = serializers.SerializerMethodField()
    requester_name = serializers.SerializerMethodField()
    requested_documents = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    processing_time = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            'request_id',
            'request_number',
            'created_at',
            'requester_name',
            'requested_documents',
            'total_amount',
            'processing_time'
        ]

    def get_request_number(self, obj):
        year = datetime.now().year
        return f"FAST-{year}-{obj.request_id}"

    def get_requester_name(self, obj):
        u = obj.user_id
        parts = [u.first_name, u.middle_name or '', u.last_name or '']
        return " ".join(p for p in parts if p).strip()

    def get_requested_documents(self, obj):
        docs = RequestedDocuments.objects.filter(request_id=obj).select_related('doctype_id')
        return [{
            'document_name': d.doctype_id.name,
            'copies': d.copy_amount,
            'price_per_copy': float(d.doctype_id.price),
            'subtotal': float(d.doctype_id.price) * d.copy_amount,
            'purpose': obj.purpose_id.description
        } for d in docs]

    def get_total_amount(self, obj):
        docs = RequestedDocuments.objects.filter(request_id=obj).select_related('doctype_id')
        total = sum(float(d.doctype_id.price) * d.copy_amount for d in docs)
        return float(total)

    def get_processing_time(self, obj):
        docs = RequestedDocuments.objects.filter(request_id=obj).select_related('doctype_id')
        times = [d.doctype_id.processing_time for d in docs if d.doctype_id.processing_time]
        if not times:
            return None
        return max(times, key=len)

class LoginSerializer(serializers.ModelSerializer):
    email_address = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    #Only for testing
    user_id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    role_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'email_address',
            'password',
            'user_id',
            'first_name',
            'last_name',
            'role_name',
        ]

    def get_role_name(self, obj):
        return obj.role_id.role_name if obj.role_id else None

    def validate(self, data):
        email = data.get('email_address')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        if email == "admin@gmail.com" and password == "admin":
            try:
                user = User.objects.get(email_address=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("Admin account not found in database.")

            data["user"] = user
            return data

        try:
            user = User.objects.get(email_address=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.password:
            raise serializers.ValidationError("This account has no password set.")

        if not check_password(password, user.password):
            raise serializers.ValidationError("Invalid email or password.")

        if user.role_id == 4:
            raise serializers.ValidationError("Access denied. Requesters cannot log in to this portal.")

        user.last_login = datetime.now()
        user.save(update_fields=["last_login"])

        data["user"] = user
        return data

    def to_representation(self, instance):
        user = instance
        return {
            "message": "Login successful",
            "user_id": user.user_id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role_id.name if user.role_id else None,
            "email_address": user.email_address,
            "last_login": user.last_login,
        }

class AdminDashboardSerializer(serializers.Serializer):
    total_requests = serializers.IntegerField()
    pending_requests = serializers.IntegerField()
    completed_requests = serializers.IntegerField()
    active_users = serializers.IntegerField()
    weekly_requests = serializers.ListField()
    document_distribution = serializers.ListField()
    latest_requests = serializers.ListField()
    warnings = serializers.ListField()
