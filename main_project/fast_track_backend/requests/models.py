from xml.dom.minidom import DocumentType

from django.db import models
from users.model import User
from doccatalog.model import DocumentType

# Create your models here.

class RequestPurpose(models.Model):
    purpose_id = models.AutoField(primary_key=True)
    description = models.CharField(max_length=30)

    def __str__(self):
        return self.description

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

'''
CREATE TABLE request_statuses (
    status_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(30) -- includes: 'requested', 'processing', 'released', 'received'
);
'''

class RequestHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    request_id = models.ForeignKey(RequestPurpose, on_delete=models.PROTECT)
    status_id = models.ForeignKey(RequestStatus, on_delete=models.PROTECT)
    user_id = models.ForeignKey(User, on_delete=models.PROTECT)
    remarks = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Req. History # {self.history_id}"

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

class Requests(models.Model):
    request_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.PROTECT)
    purpose_id = models.ForeignKey(RequestPurpose, on_delete=models.PROTECT)
    status_id = models.ForeignKey(RequestStatus, on_delete=models.PROTECT)
    copy_amount = models.IntegerField(default=1)
    notes = models.TextField(default='', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    released_at = models.DateTimeField(null=True)

    def __str__(self):
        return f"Request#{self.request_id}"
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
    request_id = models.ForeignKey(Requests, on_delete=models.PROTECT)
    doctype_id = models.ForeignKey(DocumentType, on_delete=models.PROTECT)
    copy_amount = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.doctype_id} for Request#{self.request_id}"

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