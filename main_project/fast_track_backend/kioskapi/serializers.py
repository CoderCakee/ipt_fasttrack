from rest_framework.views import APIView
from rest_framework import serializers
from users.models import User, Role
from requests.models import Request, RequestedDocuments, RequestPurpose, RequestStatus
from doccatalog.models import DocumentType
from datetime import datetime

class RequestedDocumentSerializer(serializers.ModelSerializer):
    doctype_id = serializers.PrimaryKeyRelatedField(
        queryset=DocumentType.objects.filter(is_enabled=True),
        source='doctype'
    )
    copy_amount = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = RequestedDocuments
        fields = ['doctype_id', 'copy_amount']

class CheckRequestNumberSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_id.first_name', read_only=True)
    last_name = serializers.CharField(source='user_id.last_name', read_only=True)
    student_number = serializers.SerializerMethodField()
    request_number = serializers.SerializerMethodField()
    date_requested = serializers.DateTimeField(source='created_at', format='%B %d, %Y %I:%M %p')
    request_status = serializers.CharField(source='status_id.description', read_only=True)
    documents = RequestedDocumentSerializer(source='requesteddocuments_set', many=True, read_only=True)

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
    # User info (first name, last name, etc.)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    student_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email_address = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    mobile_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # Document info
    purpose_id = serializers.PrimaryKeyRelatedField(
        queryset=RequestPurpose.objects.all(),
        source='purpose'
    )
    requested_document = RequestedDocumentSerializer(write_only=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Request
        fields = [
            'first_name', 'last_name', 'middle_name', 'student_number',
            'email_address', 'mobile_number', 'purpose_id', 'requested_document', 'notes'
        ]

    def validate(self, data):
        # Ensure either email or mobile number is filled
        if not data.get('email_address') and not data.get('mobile_number'):
            raise serializers.ValidationError("Either email or mobile number must be provided.")
        return data

    def create(self, validated_data):
        # Extract user info
        user_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'middle_name': validated_data.pop('middle_name', ''),
            'student_number': validated_data.pop('student_number', None),
            'email_address': validated_data.pop('email_address', None),
            'mobile_number': validated_data.pop('mobile_number', None),
            'role_id': 3  # Assuming role_id=3 is 'requester' or student
        }
        user, _ = User.objects.get_or_create(
            email_address=user_data.get('email_address'),
            mobile_number=user_data.get('mobile_number'),
            defaults=user_data
        )

        # Default status is "requested"
        request_status = RequestStatus.objects.get(description='Requested')

        # Create the request
        request_obj = Request.objects.create(
            user=user,
            purpose=validated_data['purpose'],
            status=request_status,
            notes=validated_data.get('notes', '')
        )

        # Create requested document
        doc_data = validated_data['requested_document']
        RequestedDocuments.objects.create(
            request=request_obj,
            doctype=doc_data['doctype'],
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
        u = obj.user
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
        return max(times, key=len)  # Still fine unless you switch to numeric days
