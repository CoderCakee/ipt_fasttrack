from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from requests.models import Request
from .serializers import CheckRequestNumberSerializer

# Create your views here.
@api_view(['GET','POST'])
def CheckRequestNumberView(request, request_id=None):
    if request.method == 'POST':
        req_number = request.data.get('request_number')
        if not req_number:
            return Response({'error': 'Request number is required.'}, status=status.HTTP_400_BAD_REQUEST)
        from datetime import datetime
        current_year = datetime.now().year
        prefix = f'FAST-{current_year}-'
        number = req_number.replace(prefix, '')
        try:
            req = Request.objects.get(request_id=number)
        except Request.DoesNotExist:
            return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True, 'request_id': req.request_id}, status=status.HTTP_200_OK)

    elif request.method == 'GET':
        if not request_id:
            return Response({'error': 'Request ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            req = Request.objects.get(request_id=request_id)
        except Request.DoesNotExist:
            return Response({'error': 'Request not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CheckRequestNumberSerializer(req)
        return Response(serializer.data, status=status.HTTP_200_OK)