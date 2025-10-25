from django.db.models import Count, Q
from django.conf import settings

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from requests.models import Request, RequestPurpose
from users.models import User
from users.auth import TokenAuthentication
from doccatalog.models import DocumentType
from payments.models import Payment
from .serializers import (CheckRequestNumberSerializer, CheckRequestByStudentSerializer,
                          RequestCreateSerializer, RequestReceiptSerializer,
                          LoginSerializer, AdminDashboardSerializer, AdminRequestManagerSerializer)

from datetime import datetime, timedelta, UTC
import jwt

# Kiosk API Views
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

#Admin API Views
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

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_payment_manager_view(request):
    pass

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_notification_manager_view(request):
    pass

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_user_manager_view(request):
    pass

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def admin_log_manager_view(request):
    pass