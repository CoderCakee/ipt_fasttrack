from django.urls import path
from .views import (check_request_number_view, check_request_by_student_view, get_request_details_view,
                    request_receipt_view, request_document_view, login_view,
                    refresh_token_view, admin_dashboard_view, admin_request_manager_view)

urlpatterns = [
    #Check Status
    path('check-request-number/', check_request_number_view, name='check-request-number'),
    path('check-request-by-student/', check_request_by_student_view, name='check-request-by-student'),
    path('check-request-details/<int:request_id>/', get_request_details_view, name='get-request-details'),
    #Request Document
    path('request-create/', request_document_view, name='request-create'),
    path('request-receipt/<int:request_id>/', request_receipt_view, name='request-receipt'),
    #Multi-Document Request
    path('multi-request-create/', request_document_view, name='multi-request-create'),
    path('multi-request-receipt/<int:request_id>/', request_receipt_view, name='multi-request-receipt'),
    #Login
    path('login/', login_view, name='login'),
    path('refresh/', refresh_token_view, name='refresh'),
    #Admin Dashboard
    path('admin-dashboard/home/', admin_dashboard_view, name='admin-dashboard'),
    path('admin-dashboard/request-management/', admin_request_manager_view, name='admin-request-management')
]