from django.urls import path
from .views import CheckRequestNumberView

urlpatterns = [
    path('check-request-number/<int:request_id>/', CheckRequestNumberView, name='check-request-number'),
]