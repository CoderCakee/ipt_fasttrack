#from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from requests.models import Request, RequestPurpose, RequestStatus, RequestedDocuments
from users.models import User, Role
from doccatalog.models import DocumentType
from .serializers import CheckRequestNumberSerializer, CheckRequestByStudentSerializer, RequestCreateSerializer, RequestReceiptSerializer, LoginSerializer
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
        serializer = RequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            request_obj = serializer.save()
            receipt_serializer = RequestReceiptSerializer(request_obj)
            return Response(receipt_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def RequestReceiptView(request, request_id):
    try:
        req = Request.objects.select_related('user', 'purpose').get(pk=request_id)
    except Request.DoesNotExist:
        return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RequestReceiptSerializer(req)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def LoginView(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.validated_data['user']

        # Update last login timestamp
        user.last_login = datetime.now()
        user.save(update_fields=['last_login'])

        # Return the serialized representation (handled by to_representation)
        return Response(serializer.to_representation(user), status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)