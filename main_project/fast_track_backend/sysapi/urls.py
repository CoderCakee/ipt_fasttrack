from django.urls import path
from .views import (check_request_number_view, check_request_by_student_view, get_request_details_view,
                    request_receipt_view, request_document_view, login_view,
                    refresh_token_view, admin_dashboard_view, admin_request_manager_view,
                    admin_send_notification_view, admin_notification_history_view, admin_notification_templates_view,
                    admin_notification_template_detail_view, rfid_lookup_view, admin_user_detail_view,
                    admin_user_management_view, admin_role_management_view, admin_utils_dropdowns,
                    check_request_status_view)

urlpatterns = [
    #Check Status
    path('check-request-number/', check_request_number_view, name='check-request-number'),
    path('check-request-by-student/', check_request_by_student_view, name='check-request-by-student'),
    path('check-request-details/<int:request_id>/', get_request_details_view, name='get-request-details'),
    #Request Documents
    path('lookup-rfid/', rfid_lookup_view, name='lookup-rfid'),
    path('request-create/', request_document_view, name='request-create'),
    path('request-receipt/<int:request_id>/', request_receipt_view, name='request-receipt'),
    #Multi-Document Request
    path('multi-request-create/', request_document_view, name='multi-request-create'),
    path('multi-request-receipt/<int:request_id>/', request_receipt_view, name='multi-request-receipt'),
    #Login
    path('login/', login_view, name='login'),
    path('refresh/', refresh_token_view, name='refresh'),
    path('check-status-qr/', check_request_status_view, name='check-status-qr'),
    #Admin Dashboard
    path('admin-dashboard/home/', admin_dashboard_view, name='admin-dashboard'),
    path('admin-dashboard/request-management/', admin_request_manager_view, name='admin-request-management'),
    path('admin-dashboard/notifications/send', admin_send_notification_view, name='admin-notification-send'),
    path('admin-dashboard/notifications/history', admin_notification_history_view, name='admin-notification-history'),
    path('admin-dashboard/notifications/templates', admin_notification_templates_view, name='admin-notification-templates'),
    path('admin-dashboard/notifications/templates-detail', admin_notification_template_detail_view, name='admin-notification-template-detail'),
    path('admin-dashboard/users/', admin_user_management_view, name='admin-user-list-create'),
    path('admin-dashboard/users/<int:pk>/', admin_user_detail_view, name='admin-user-detail'),
    path('admin-dashboard/roles/', admin_role_management_view, name='admin-role-list'),
    path('admin-dashboard/utils/dropdowns/', admin_utils_dropdowns, name='admin-utils-dropdowns'),
]