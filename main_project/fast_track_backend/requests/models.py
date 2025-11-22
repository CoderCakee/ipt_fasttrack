from xml.dom.minidom import DocumentType

from django.db import models

from django.core.validators import MinValueValidator

# Create your models here.

class RequestPurpose(models.Model):
    purpose_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=30)

    def __str__(self):
        return self.description

    class Meta:
        app_label = 'requests'
        db_table = 'request_purposes'

'''
CREATE TABLE request_purposes (
    purpose_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) -- includes: 'reference', 'further studies', 'board exam', 'evaluation', 'others'
);
'''

class RequestStatus(models.Model):
    status_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=30)

    def __str__(self):
        return self.description

    class Meta:
        app_label = 'requests'
        db_table = 'request_statuses'

'''
CREATE TABLE request_statuses (
    status_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) -- includes: 'requested', 'processing', 'released', 'received'
);
'''

class Request(models.Model):
    request_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey('users.User', on_delete=models.RESTRICT, db_column='user_id')
    purpose_id = models.ForeignKey(RequestPurpose, on_delete=models.RESTRICT, db_column='purpose_id')
    status_id = models.ForeignKey(RequestStatus, on_delete=models.RESTRICT, db_column='status_id')
    copy_amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    released_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Request#{self.request_id}"

    class Meta:
        app_label = 'requests'
        db_table = 'requests'

'''
CREATE TABLE requests (
    request_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    purpose_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    copy_amount INTEGER DEFAULT 1 CHECK (copy_amount > 0),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    released_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (purpose_id) REFERENCES request_purposes(purpose_id),
    FOREIGN KEY (status_id) REFERENCES request_statuses(status_id)
);
'''

class RequestedDocuments(models.Model):
    reqdoc_id = models.AutoField(primary_key=True)
    request_id = models.ForeignKey(Request, on_delete=models.CASCADE, db_column='request_id')
    doctype_id = models.ForeignKey('doccatalog.DocumentType', on_delete=models.RESTRICT, db_column='doctype_id')
    copy_amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.doctype_id} for {self.request_id}"

    class Meta:
        app_label = 'requests'
        db_table = 'requested_documents'

'''
CREATE TABLE requested_documents (
    reqdoc_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    request_id INTEGER NOT NULL,
    doctype_id INTEGER NOT NULL,
    copy_amount INTEGER DEFAULT 1 CHECK (copy_amount > 0),
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (doctype_id) REFERENCES document_types(doctype_id)
);
'''

class RequestHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    request_id = models.ForeignKey(Request, on_delete=models.CASCADE, db_column='request_id')
    status_id = models.ForeignKey(RequestStatus, on_delete=models.PROTECT, db_column='status_id')
    user_id = models.ForeignKey('users.User', on_delete=models.PROTECT, null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request History #{self.history_id}"

    class Meta:
        app_label = 'requests'
        db_table = 'request_history'

'''
CREATE TABLE request_history (
    history_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    request_id INTEGER NOT NULL,
    status_id INTEGER NOT NULL,
    user_id INTEGER, -- The admin/staff who commits the change
    remarks TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES request_statuses(status_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
'''