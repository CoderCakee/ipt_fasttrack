from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers
from users.models import User, Role, RoleStatus, Department
from requests.models import Request, RequestedDocuments, RequestPurpose, RequestStatus
from doccatalog.models import DocumentType
from notifications.models import Notification, Templates
from datetime import datetime
from django.contrib.auth import get_user_model

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
    # ADDED: Purpose is now validated here per document
    purpose_id = serializers.PrimaryKeyRelatedField(
        queryset=RequestPurpose.objects.all(),
        source='purpose'
    )
    copy_amount = serializers.IntegerField(min_value=1, default=1)

    class Meta:
        model = RequestedDocuments
        fields = [
            'doctype_id',
            'purpose_id', # Add this
            'copy_amount',
        ]

class RequestedDocumentReceiptSerializer(serializers.ModelSerializer):
    # Retrieve readable names instead of just IDs
    document_name = serializers.CharField(source='doctype_id.name', read_only=True)
    price = serializers.DecimalField(source='doctype_id.price', max_digits=10, decimal_places=2, read_only=True)
    purpose_description = serializers.CharField(source='purpose_id.description', read_only=True)

    class Meta:
        model = RequestedDocuments
        fields = [
            'document_name',
            'price',
            'copy_amount',
            'purpose_description'
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
        current_year = datetime.now().year
        return f'FAST-{current_year}-{obj.request_id}'

#!!DEPRECIATE
class CheckRequestByStudentSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=35)
    last_name = serializers.CharField(max_length=35)
    student_number = serializers.CharField(max_length=15)

class RequestCreateSerializer(serializers.ModelSerializer):
    # (Personal details remain the same...)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    student_number = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email_address = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    mobile_number = serializers.CharField(write_only=True, required=False, allow_blank=True)

    # REMOVED: purpose_id is no longer a global field

    requested_documents = RequestedDocumentCreateSerializer(write_only=True, many=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Request
        fields = [
            'first_name', 'last_name', 'middle_name', 'student_number',
            'email_address', 'mobile_number', 'requested_documents', 'notes'
            # REMOVED: 'purpose_id' from fields
        ]

    def validate(self, data):
        # (Normalization logic remains the same...)
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

        # (User creation/finding logic remains exactly the same...)
        def smart_capitalize(name: str) -> str:
            import re
            if not name: return name
            name = re.sub(r'\s+', ' ', name.strip().lower())

            def fix_mc(match):
                return match.group(1).capitalize() + match.group(2).capitalize()

            parts = name.split()
            lowercase_exceptions = {"de", "del", "dela", "di", "du", "van", "von", "bin", "binti", "ibn", "al", "da",
                                    "la"}
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

        user = None
        email = user_data.get('email_address')
        mobile = user_data.get('mobile_number')

        if email: user = User.objects.filter(email_address=email).first()
        if not user and mobile: user = User.objects.filter(mobile_number=mobile).first()

        if user:
            updated = False
            for field, value in user_data.items():
                if value and getattr(user, field) != value:
                    setattr(user, field, value)
                    updated = True
            if updated: user.save()
        else:
            requester_role = Role.objects.get(pk=4)
            user = User.objects.create(**user_data, role_id=requester_role)

        request_status = RequestStatus.objects.get(description__iexact='requested')

        # UPDATED: Create the parent Request WITHOUT purpose_id
        request_obj = Request.objects.create(
            user_id=user,
            status_id=request_status,
            notes=validated_data.get('notes', '')
        )

        # UPDATED: Loop through docs and save the purpose for EACH document
        for doc_data in requested_docs_data:
            RequestedDocuments.objects.create(
                request_id=request_obj,
                doctype_id=doc_data['doctype'],
                purpose_id=doc_data['purpose'],  # Now saving purpose here
                copy_amount=doc_data.get('copy_amount', 1)
            )

        return request_obj

class RequestReceiptSerializer(serializers.ModelSerializer):
    # Fetch user details
    first_name = serializers.CharField(source='user_id.first_name', read_only=True)
    last_name = serializers.CharField(source='user_id.last_name', read_only=True)
    middle_name = serializers.CharField(source='user_id.middle_name', read_only=True)
    student_number = serializers.CharField(source='user_id.student_number', read_only=True)

    # Nested serializer to get the list of docs with their names
    requested_documents = RequestedDocumentReceiptSerializer(
        source='requesteddocuments_set',
        many=True,
        read_only=True
    )

    class Meta:
        model = Request
        fields = [
            'request_id',
            'first_name',
            'last_name',
            'middle_name',
            'student_number',
            'created_at',
            'requested_documents',  # This contains the list defined above
        ]

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

class AdminRequestManagerSerializer(serializers.ModelSerializer):
    request_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    requested_documents = serializers.SerializerMethodField()
    date_submitted = serializers.DateTimeField(source='created_at', read_only=True)
    status = serializers.CharField(source='status_id.description')

    class Meta:
        model = Request
        fields = [
            'request_id',
            'request_number',
            'full_name',
            'user_id',
            'status',
            'date_submitted',
            'requested_documents',
        ]

    def get_request_number(self, obj):
        current_year = datetime.now().year
        return f'FAST-{current_year}-{obj.request_id}'

    def get_full_name(self, obj):
        u = obj.user_id
        parts = [u.first_name, u.middle_name or '', u.last_name or '']
        return " ".join(p for p in parts if p).strip()

    def get_requested_documents(self, obj):
        requested_docs = RequestedDocuments.objects.filter(request_id=obj)
        serializer = RequestedDocumentCheckSerializer(requested_docs, many=True)
        return serializer.data

class AdminSendNotifSerializer(serializers.ModelSerializer):
    # Map "recipient" to Notification.user_id
    recipient = serializers.SlugRelatedField(
        slug_field='email_address',  # your custom email field
        queryset=User.objects.all(),
        source='user_id'
    )
    request_number = serializers.CharField(write_only=True, required=False)
    subject = serializers.CharField(write_only=True, required=False, allow_blank=True)
    template_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Notification
        fields = [
            'notif_id',
            'type',
            'recipient',       # maps to user_id
            'request_number',
            'message',
            'subject',
            'template_id',
            'status',
            'created_at',
            'sent_at',
        ]
        read_only_fields = ['notif_id', 'status', 'created_at', 'sent_at']

    def create(self, validated_data):
        # Extract extra fields
        request_number = validated_data.pop('request_number', None)
        subject = validated_data.pop('subject', "")
        template_id = validated_data.pop('template_id', None)

        reference_table = 'requests'
        reference_id = None

        if request_number:
            try:
                request_id = int(request_number.split('-')[-1])
                request_obj = Request.objects.get(request_id=request_id)
                reference_id = request_obj.request_id
            except (Request.DoesNotExist, ValueError):
                raise serializers.ValidationError("Invalid request number provided.")

        validated_data['reference_table'] = reference_table
        validated_data['reference_id'] = reference_id

        notification = Notification.objects.create(**validated_data)
        # Attach subject and template_id to instance for use in the view
        notification._subject = subject
        notification._template_id = template_id
        return notification

class AdminNotifHistorySerializer(serializers.ModelSerializer):
    #GET
    recipient_name = serializers.SerializerMethodField()
    recipient_email = serializers.EmailField(source='user_id.email', read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'notif_id',
            'type',
            'type_display',
            'subject',
            'recipient_name',
            'recipient_email',
            'message',
            'status',
            'created_at',
            'sent_at',
        ]

    def get_recipient_name(self, obj):
        u = obj.user_id
        return f"{u.first_name} {u.last_name}".strip()

class AdminNotifTemplatesSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Templates
        fields = [
            'template_id',
            'type',
            'type_display',
            'subject',
            'template_msg',
        ]
        read_only_fields = ['template_id', 'type_display']

    def validate(self, data):
        if data.get('type') == 'email' and not data.get('subject'):
            raise serializers.ValidationError("Email templates must have a subject.")

        return data


# --- Helper Serializers for Dropdowns ---
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'name', 'description']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'name']


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleStatus
        fields = ['status_id', 'description']


# --- READ Serializer (For the Card Display) ---
class AdminUserListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    # We use source to jump across foreign keys to get the actual names
    role = serializers.CharField(source='role_id.name', read_only=True)
    department = serializers.CharField(source='department_id.name', read_only=True)
    status = serializers.CharField(source='status_id.description', read_only=True)

    class Meta:
        model = User
        fields = [
            'user_id', 'full_name', 'email_address', 'role',
            'department', 'status', 'last_login', 'created_at'
        ]

    def get_full_name(self, obj):
        # Handle potential None values gracefully
        first = obj.first_name or ""
        middle = obj.middle_name or ""
        last = obj.last_name or ""
        return f"{first} {middle} {last}".strip()


# --- WRITE Serializer (For Add/Edit) ---
class AdminUserCRUDSerializer(serializers.ModelSerializer):
    # We explicitly define these to ensure they accept IDs for input
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all())
    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False,
                                                       allow_null=True)
    status_id = serializers.PrimaryKeyRelatedField(queryset=RoleStatus.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'first_name', 'middle_name', 'last_name',
            'email_address', 'role_id', 'department_id',
            'status_id', 'password', 'rfid_num'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},  # Password optional on Edit
            'rfid_num': {'required': False}  # Making this optional for Admin creation if they don't have card yet
        }

    def create(self, validated_data):
        # Hash the password before saving
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])

        # Handle RFID if not provided (Assuming 0 as placeholder if your DB allows)
        if 'rfid_num' not in validated_data:
            validated_data['rfid_num'] = 0

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Only hash password if it's being changed
        if 'password' in validated_data and validated_data['password']:
            validated_data['password'] = make_password(validated_data['password'])
        elif 'password' in validated_data:
            # If empty password sent, remove it so we don't overwrite existing hash with empty string
            validated_data.pop('password')

        return super().update(instance, validated_data)

'''
5. USER MANAGEMENT
    - Has a button for managing roles leading to MANAGE ROLES (5A)
    - Has a button for adding a user leading to ADD USER (5B)
    - Displays system users in cards with information like full name, role, status, email address, what department they belong in, last login time, when the user was created, and each card has a button for deactivating the user, resetting the password, editing the user which leads to EDIT USER (5C), and deleting the user which leads to DELETE USER (5D)
      a. MANAGE ROLES
        - Has cards that show the roles and the permissions that each role is attached to
      b. ADD USER
        - Has a field for full name (Should probably be separated into first name, middle name, last name)
        - Has a field for email
        - Has a dropdown for role
        - Has a field for department
        - Has a field for temporary password
        - Has a button for adding user
      c. EDIT USER
        - Has a field for full name (Should probably be separated into first name, middle name, last name)
        - Has a field for email
        - Has a dropdown for role
        - Has a field for department
        - Has a dropdown for status
        - Has a button for saving changes
      d. DELETE USER
        - Has a button for deleting the user
        - Has a button for cancelling action
'''