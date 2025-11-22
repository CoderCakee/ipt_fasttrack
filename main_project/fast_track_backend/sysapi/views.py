#<editor-fold desc="Imports">
from django.db.models import Count, Q
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password, make_password

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from requests.models import Request, RequestPurpose
from users.models import User, Role, RoleStatus, Department
from users.auth import TokenAuthentication
from doccatalog.models import DocumentType
from payments.models import Payment
from notifications.models import Notification, Templates
from .serializers import (CheckRequestNumberSerializer, CheckRequestByStudentSerializer,
                          RequestCreateSerializer, RequestReceiptSerializer,
                          LoginSerializer, AdminDashboardSerializer, AdminRequestManagerSerializer,
                          AdminSendNotifSerializer, AdminNotifHistorySerializer, AdminNotifTemplatesSerializer,
                          AdminUserListSerializer, AdminUserCRUDSerializer, RoleSerializer,
                          DepartmentSerializer, StatusSerializer)

from hardware_scripts.gsm import *
from hardware_scripts.printer import *

from datetime import datetime, timedelta, UTC
import jwt
#</editor-fold>

# <editor-fold desc="Kiosk API Views">
@api_view(['POST'])
def check_request_number_view(request):
    req_number = request.data.get('request_number')
    if not req_number:
        return Response({'error': 'Request number is required.'}, status=status.HTTP_400_BAD_REQUEST)

    current_year = datetime.now().year
    prefix = f'FAST-{current_year}-'
    number = req_number.replace(prefix, '')

    try:
        req = Request.objects.get(request_id=number)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'success': True, 'request_id': req.request_id}, status=status.HTTP_200_OK)

@api_view(['POST'])
def check_request_by_student_view(request):
    serializer = CheckRequestByStudentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    student_number = data['student_number'].strip()

    try:
        user = User.objects.get(
            first_name__iexact=first_name,
            last_name__iexact=last_name,
            student_number__iexact=student_number,
        )
    except User.DoesNotExist:
        return Response({'error': 'No matching student found.'}, status=status.HTTP_404_NOT_FOUND)

    requests = Request.objects.filter(user_id=user.user_id).order_by('-created_at')

    if not requests.exists():
        return Response({'error': 'No document requests found.'}, status=status.HTTP_404_NOT_FOUND)

    req_serializer = CheckRequestNumberSerializer(requests, many=True)

    return Response({
        'student': {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'student_number': user.student_number,
        },
        'total_requests': requests.count(),
        'requests': req_serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_request_details_view(request, request_id):
    try:
        req = Request.objects.get(request_id=request_id)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CheckRequestNumberSerializer(req)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def request_document_view(request):
    if request.method == 'GET':
        document_types = DocumentType.objects.filter(is_enabled=True).values(
            'doctype_id', 'name', 'processing_time', 'price'
        )
        purposes = RequestPurpose.objects.all().values('purpose_id', 'description')

        return Response({
            'document_types': list(document_types),
            'purposes': list(purposes)
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = RequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            request_obj = serializer.save()
            receipt_serializer = RequestReceiptSerializer(request_obj)
            return Response(receipt_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def request_receipt_view(request, request_id):
    try:
        req = Request.objects.select_related('user', 'purpose').get(pk=request_id)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RequestReceiptSerializer(req)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def rfid_lookup_view(request):
    # Get the rfid number from the query parameters (e.g., ?rfid=0012345)
    rfid_input = request.query_params.get('rfid', None)

    if not rfid_input:
        return Response(
            {"error": "RFID number is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # NOTE: Your model uses IntegerField for rfid_num.
        # If the card sends "0012345", Python might see "12345".
        # Ensure we cast input to int to match the database storage.
        rfid_int = int(rfid_input)

        user = User.objects.get(rfid_num=rfid_int)

        # Construct the data payload matching your React form fields
        data = {
            "first_name": user.first_name,
            "middle_name": user.middle_name if user.middle_name else "",
            "last_name": user.last_name,
            "student_id": user.student_number,  # Mapping student_number to ID
            "email": user.email_address,
            "relationship": "Current Student",  # Or logic to determine this based on role_id
        }
        return Response(data, status=status.HTTP_200_OK)

    except ValueError:
        return Response(
            {"error": "Invalid RFID format."},
            status=status.HTTP_400_BAD_REQUEST
        )
    except User.DoesNotExist:
        return Response(
            {"error": "Student not found with this RFID tag."},
            status=status.HTTP_404_NOT_FOUND
        )

'''
For the frontend:
const handleScan = async (scannedRfid) => {
    try {
        // Call your new Django endpoint
        const response = await axios.get(`/api/lookup-rfid/?rfid=${scannedRfid}`);
        
        const data = response.data;

        // Update your form state
        setFormData({
            firstName: data.first_name,
            middleName: data.middle_name,
            lastName: data.last_name,
            studentId: data.student_id,
            email: data.email,
            // Keep phone empty as requested
            phoneNumber: formData.phoneNumber 
        });

        // Close scan modal/dialog
        setIsScanning(false);
        
    } catch (error) {
        console.error("Scan failed", error);
        alert("Student not found or RFID error.");
    }
};
'''
# </editor-fold>

# <editor-fold desc="Admin API Views">
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']

        user.last_login = datetime.now()
        user.save(update_fields=['last_login'])

        access_payload = {
            'user_id': user.pk,
            'role': user.role_id.name if user.role_id else None,
            'exp': datetime.now(UTC) + settings.JWT_EXPIRATION_DELTA,
            'iat': datetime.now(UTC),
        }

        refresh_payload = {
            'user_id': user.pk,
            'type': 'refresh',
            'exp': datetime.utcnow() + timedelta(days=7),  # longer lifespan
            'iat': datetime.utcnow(),
        }

        access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

        data = serializer.to_representation(user)
        data['access_token'] = access_token
        data['refresh_token'] = refresh_token

        return Response(data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Our system uses token-based authentication so call this to refresh the token
@api_view(['POST'])
def refresh_token_view(request):
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
        return Response({'error': 'Refresh token required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return Response({'error': 'Refresh token expired'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)

    if payload.get('type') != 'refresh':
        return Response({'error': 'Invalid token type'}, status=status.HTTP_400_BAD_REQUEST)

    user_id = payload['user_id']

    new_access_payload = {
        'user_id': user_id,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=30),
        'iat': datetime.utcnow(),
    }

    new_access_token = jwt.encode(new_access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    return Response({'access_token': new_access_token}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_dashboard_view(request):
    user = request.user

    if not user.role_id or user.role_id.name.lower() not in ['admin', 'staff', 'registrar']:
        return Response({'error': 'You do not have permission to view this page.'},
                        status=status.HTTP_403_FORBIDDEN)

    total_requests = Request.objects.count()
    pending_requests = Request.objects.filter(
        status_id__description__iexact='requested'
    ).count()
    completed_requests = Request.objects.filter(
        status_id__description__iexact='received'
    ).count()
    active_users = User.objects.exclude(role_id__name__iexact="Requester").count()

    today = datetime.today()
    last_week = today - timedelta(days=7)
    weekly_data = (
        Request.objects.filter(created_at__gte=last_week)
        .extra({'day': "DATE(created_at)"})
        .values('day')
        .annotate(count=Count('request_id'))
        .order_by('day')
    )
    weekly_requests = [
        {"date": str(d["day"]), "count": d["count"]} for d in weekly_data
    ]

    doc_dist = (
        DocumentType.objects.filter(is_enabled=True)
        .annotate(total=Count('requesteddocuments'))
        .values('name', 'total')
    )
    document_distribution = [
        {"name": d["name"], "count": d["total"]} for d in doc_dist
    ]

    latest_requests_qs = (
        Request.objects.select_related('user_id', 'status_id')
        .order_by('-created_at')[:3]
    )
    latest_requests = [
        {
            "request_id": r.request_id,
            "student_name": f"{r.user_id.first_name} {r.user_id.last_name}",
            "status": r.status_id.description,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for r in latest_requests_qs
    ]

    warnings = []
    unpaid = Payment.objects.filter(status='pending').count()
    if unpaid > 0:
        warnings.append(f"There are {unpaid} unpaid requests pending verification.")
    if pending_requests > 10:
        warnings.append("High volume of pending document requests — consider processing soon.")

    serializer = AdminDashboardSerializer({
        "total_requests": total_requests,
        "pending_requests": pending_requests,
        "completed_requests": completed_requests,
        "active_users": active_users,
        "weekly_requests": weekly_requests,
        "document_distribution": document_distribution,
        "latest_requests": latest_requests,
        "warnings": warnings,
    })

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_request_manager_view(request):
    search_query = request.query_params.get('search', '').strip()
    status_id = request.query_params.get('status_id')

    queryset = (
        Request.objects
        .select_related('user_id', 'status_id')
        .prefetch_related('requesteddocuments_set__doctype_id')
        .order_by('-created_at')
    )

    if search_query:
        queryset = queryset.filter(
            Q(user_id__first_name__icontains=search_query) |
            Q(user_id__last_name__icontains=search_query) |
            Q(user_id__student_number__icontains=search_query) |
            Q(request_id__icontains=search_query)
        )

    if status_id:
        queryset = queryset.filter(status_id=status_id)

    serializer = AdminRequestManagerSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_send_notification_view(request):
    serializer = AdminSendNotifSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        #EMAIL/SMS LOGIC (Scripts)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_notification_history_view(request):
    search_query = request.query_params.get('search', '').strip()
    notif_status = request.query_params.get('status')

    queryset = (
        Notification.objects
        .select_related('user_id')
        .order_by('-created_at')
    )

    if search_query:
        queryset = queryset.filter(
            Q(user_id__first_name__icontains=search_query) |
            Q(user_id__last_name__icontains=search_query) |
            Q(user_id__email_address__icontains=search_query) |
            Q(subject__icontains=search_query)
        )

    if notif_status:
        queryset = queryset.filter(status=notif_status)

    serializer = AdminNotifHistorySerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_notification_templates_view(request):
    if request.method == 'GET':
        templates = Templates.objects.all().order_by('type')
        serializer = AdminNotifTemplatesSerializer(templates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = AdminNotifTemplatesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_notification_template_detail_view(request, pk):
    template = get_object_or_404(Templates, pk=pk)

    if request.method == 'GET':
        serializer = AdminNotifTemplatesSerializer(template)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = AdminNotifTemplatesSerializer(template, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        template.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# --- 5A, 5B & List: User Management ---
@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_user_management_view(request):
    # GET: List Users (With Search and Filtering)
    if request.method == 'GET':
        search_query = request.query_params.get('search', '').strip()
        role_filter = request.query_params.get('role')

        queryset = User.objects.select_related('role_id', 'department_id', 'status_id').all().order_by('-created_at')

        if search_query:
            queryset = queryset.filter(
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(email_address__icontains=search_query)
            )

        if role_filter:
            queryset = queryset.filter(role_id__name=role_filter)

        serializer = AdminUserListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Add User (5B)
    elif request.method == 'POST':
        serializer = AdminUserCRUDSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- 5C, 5D: Detail, Edit, Delete, Reset Pass ---
@api_view(['GET', 'PUT', 'DELETE', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_user_detail_view(request, pk):
    user = get_object_or_404(User, pk=pk)

    # GET: Fetch single user details
    if request.method == 'GET':
        serializer = AdminUserListSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # PUT: Edit User (5C) - Expects full object or partial
    elif request.method == 'PUT':
        # partial=True allows sending just the fields you want to change
        serializer = AdminUserCRUDSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Return the "List" format so the frontend can update the card immediately
            read_serializer = AdminUserListSerializer(user)
            return Response(read_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete User (5D)
    elif request.method == 'DELETE':
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    # PATCH: Specific for Password Reset (Optional utility)
    elif request.method == 'PATCH':
        new_pass = request.data.get('password')
        if new_pass:
            user.password = make_password(new_pass)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "No password provided"}, status=status.HTTP_400_BAD_REQUEST)


# --- 5A: Manage Roles (View Roles) ---
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_role_management_view(request):
    roles = Role.objects.all()
    serializer = RoleSerializer(roles, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# --- UTILITY: Dropdown Data for Frontend ---
# Your frontend needs this to populate the <select> options in Add/Edit User
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_utils_dropdowns(request):
    roles = Role.objects.all()
    departments = Department.objects.all()
    statuses = RoleStatus.objects.all()

    return Response({
        "roles": RoleSerializer(roles, many=True).data,
        "departments": DepartmentSerializer(departments, many=True).data,
        "statuses": StatusSerializer(statuses, many=True).data
    }, status=status.HTTP_200_OK)

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
# </editor-fold>

#Hardware API Views