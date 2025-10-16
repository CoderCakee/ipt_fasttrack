from rest_framework.views import APIView
from rest_framework import serializers
from users.models import User
from requests.models import Request, RequestedDocuments
from doccatalog.models import DocumentType

class RequestedDocumentSerializer(serializers.ModelSerializer):
    doctype_name = serializers.CharField(source='doctype_id.name', read_only=True)
    processing_time = serializers.CharField(source='doctype_id.processing_time', read_only=True)

    class Meta:
        model = RequestedDocuments
        fields = [
            'doctype_name',
            'copy_amount',
            'processing_time',
        ]

class CheckRequestNumberSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_id.first_name', read_only=True)
    last_name = serializers.CharField(source='user_id.last_name', read_only=True)
    student_number = serializers.SerializerMethodField()
    request_number = serializers.SerializerMethodField()
    date_requested = serializers.DateTimeField(source='created_at', format='%Y-%m-%d %H:%M')
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

class CheckRequestDetailSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=35)
    last_name = serializers.CharField(max_length=35)
    student_number = serializers.CharField(max_length=15)


