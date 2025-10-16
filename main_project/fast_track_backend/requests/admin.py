from django.contrib import admin

from .models import Request, RequestedDocuments, RequestStatus, RequestHistory, RequestPurpose
# Register your models here.

admin.site.register(Request)
admin.site.register(RequestedDocuments)
admin.site.register(RequestStatus)
admin.site.register(RequestHistory)
admin.site.register(RequestPurpose)