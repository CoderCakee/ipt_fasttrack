from django.db import models

# Create your models here.
class PriorityCategory(models.Model): #Each that inherits models.Model is a database table
    category = models.CharField( #Instances of this class signify a row in the table
        max_length=20,
        choices=[
            ('pregnant', 'Pregnant'),
            ('pwd', 'Person with Disability'),
            ('senior', 'Senior Citizen')
        ]
    )
    priority_level = models.IntegerField()

    def __str__(self):
        return self.category

class User(models.Model):
    USER_TYPES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('requester', 'Requester'),
    ]

    priority = models.ForeignKey(PriorityCategory, null=True, blank=True, on_delete=models.SET_NULL)
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, blank=True)
    last_name = models.CharField(max_length=35)
    student_number = models.CharField(max_length=15, blank=True)
    email_address = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=20, blank=True)
    password = models.CharField(max_length=255)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='requester')
    is_enabled = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"