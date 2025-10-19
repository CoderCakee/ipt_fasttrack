from django.urls import path
from .views import CheckRequestNumberView, CheckRequestByStudentView ,GetRequestDetailsView, RequestReceiptView, RequestDocumentView

'''urlpatterns = [
    path('check-request-number/<int:request_id>/', CheckRequestNumberView, name='check-request-number'),
]'''

urlpatterns = [
    #Check Status
    path('check-request-number/', CheckRequestNumberView, name='check-request-number'),
    path('check-request-by-student/', CheckRequestByStudentView, name='check-request-by-student'),
    path('check-request-details/<int:request_id>/', GetRequestDetailsView, name='get-request-details'),
    #Request Document
    path('request-create/', RequestDocumentView, name='request-create'),
    path('request-receipt/<int:request_id>/', RequestReceiptView, name='request-receipt'),
]