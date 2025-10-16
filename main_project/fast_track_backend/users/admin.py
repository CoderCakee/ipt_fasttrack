from django.contrib import admin

from .models import User, Role, RoleStatus, PriorityCategory

# Register your models here.
admin.site.register(User)
admin.site.register(Role)
admin.site.register(RoleStatus)
admin.site.register(PriorityCategory)