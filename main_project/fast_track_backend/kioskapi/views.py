#from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from requests.models import Request, RequestPurpose, RequestStatus, RequestedDocuments
from users.models import User, Role
from doccatalog.models import DocumentType
from .serializers import CheckRequestNumberSerializer, CheckRequestByStudentSerializer, RequestedDocumentSerializer, RequestCreateSerializer, RequestReceiptSerializer
from datetime import datetime

# Create your views here.
@api_view(['POST'])
def CheckRequestNumberView(request):
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
def CheckRequestByStudentView(request):
    serializer = CheckRequestByStudentSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

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
        return Response({'error': 'No matching stduent found.'}, status=status.HTTP_404_NOT_FOUND)

    requests = Request.objects.filter(user_id=user.user_id).order_by('-created_at')

    if not requests.exists():
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    latest_request = requests.first()
    req_serializer = CheckRequestNumberSerializer(latest_request)

    return Response(req_serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def GetRequestDetailsView(request, request_id):
    try:
        req = Request.objects.get(request_id=request_id)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CheckRequestNumberSerializer(req)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def RequestDocumentView(request):
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
        data = request.data

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        middle_name = data.get('middle_name', '')
        student_number = data.get('student_number', None)
        email_address = data.get('email_address', None)
        mobile_number = data.get('mobile_number', None)

        if not first_name or not last_name:
            return Response({'error': 'First name and last name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not email_address and not mobile_number:
            return Response({'error': 'Either email address or mobile number must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        purpose_id = data.get('purpose_id')
        doctype_id = data.get('doctype_id')
        copy_amount = data.get('copy_amount', 1)
        notes = data.get('notes', '')

        try:
            purpose = RequestPurpose.objects.get(pk=purpose_id)
        except RequestPurpose.DoesNotExist:
            return Response({'error': 'Invalid request purpose.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            document_type = DocumentType.objects.get(pk=doctype_id, is_enabled=True)
        except DocumentType.DoesNotExist:
            return Response({'error': 'Invalid or disabled document type.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            requester_role = Role.objects.get(pk=4)
        except Role.DoesNotExist:
            return Response({'error': 'Requester role not found in database.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user, created = User.objects.get_or_create(
            email_address=email_address,
            mobile_number=mobile_number,
            defaults={
                'first_name': first_name,
                'middle_name': middle_name,
                'last_name': last_name,
                'student_number': student_number,
                'role_id': requester_role,
            }
        )

        try:
            status_requested = RequestStatus.objects.get(description__iexact='requested')
        except RequestStatus.DoesNotExist:
            return Response({'error': 'Default "requested" status not found in database.'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        new_request = Request.objects.create(
            user_id=user,
            purpose_id=purpose,
            status_id=status_requested,
            copy_amount=copy_amount,
            notes=notes
        )

        RequestedDocuments.objects.create(
            request_id=new_request,
            doctype_id=document_type,
            copy_amount=copy_amount
        )

        return Response({
            'message': 'Request submitted successfully!',
            'request_id': new_request.request_id,
            'request_date': new_request.created_at,
            'requester_name': f"{user.first_name} {user.middle_name or ''} {user.last_name}".strip(),
            'document_name': document_type.name,
            'copies': copy_amount,
            'processing_time': document_type.processing_time
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def RequestReceiptView(request, request_id):
    try:
        req = Request.objects.select_related('user', 'purpose').get(pk=request_id)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RequestReceiptSerializer(req)
    return Response(serializer.data, status=status.HTTP_200_OK)