from django.db import models

# Create your models here.
class PriorityCategory(models.Model):
    # Each that inherits models.Model is a database table
    # Instances of this class signify a row in the table
    PRIORITIES = [
        ('pregnant', 'Pregnant'),
        ('pwd', 'Person with Disability'),
        ('senior', 'Senior Citizen')
    ]

    priority_id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=30, choices=PRIORITIES)
    priority_level = models.IntegerField()

    def __str__(self):
        return self.category

    class Meta:
        app_label = 'users'
        db_table = 'priority_categories'

'''
CREATE TABLE priority_categories (
    priority_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    priority_level INTEGER NOT NULL,
    category VARCHAR(30)
);
'''

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=15, unique=True)
    description = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'users'
        db_table = 'roles'

'''
CREATE TABLE roles (
    role_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL, --roles include: admin, registrar, accounting, and requester
    description VARCHAR(50)
);
'''

class RoleStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=30)

    def __str__(self):
        return self.description

    class Meta:
        app_label = 'users'
        db_table = 'role_statuses'

'''
CREATE TABLE role_statuses (
    status_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) --statuses include: active, inactive, deleted
);
'''

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    role_id = models.ForeignKey(Role, on_delete=models.PROTECT, default=1, db_column='role_id')
    priority_id = models.ForeignKey(PriorityCategory, null=True, blank=True, on_delete=models.SET_NULL, db_column='priority_id')
    status_id = models.ForeignKey(RoleStatus, null=True, blank=True, on_delete=models.SET_NULL, db_column='status_id')
    first_name = models.CharField(max_length=35)
    middle_name = models.CharField(max_length=35, null=True, blank=True)
    last_name = models.CharField(max_length=35, null=True, blank=True)
    student_number = models.CharField(max_length=15, null=True, blank=True)
    email_address = models.EmailField(unique=True, null=True, blank=True)
    mobile_number = models.CharField(max_length=20, null=True, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_authenticated(self):
        return True

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        app_label = 'users'
        db_table = 'users'

'''
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    role_id INTEGER NOT NULL,
    priority_id INTEGER, -- Nullable because some users don't have priority privilege
    status_id INTEGER, -- Nullable because this only applies for non-requester users
    first_name VARCHAR(35) NOT NULL,
    middle_name VARCHAR(35),
    last_name VARCHAR(35), -- Nullable because some foreign students might not use last names
    student_number VARCHAR(15), -- Nullable because not all users have student numbers (Like admins, alumni, etc.)
    email_address VARCHAR(50) UNIQUE, -- Nullable because not all users have emails
    mobile_number VARCHAR(20), -- Nullable because not all users have mobile numbers
    password VARCHAR(255),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (priority_id) REFERENCES priority_categories(priority_id),
    FOREIGN KEY (status_id) REFERENCES role_statuses(status_id)
);
'''