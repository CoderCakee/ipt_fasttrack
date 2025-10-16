from django.db import models

# Create your models here.
class DocumentType(models.Model):
    doctype_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    processing_time = models.CharField(max_length=30, blank=True, null=True)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'doccatalog'
        db_table = 'document_types'

'''
CREATE TABLE document_types (
    doctype_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL, --document types include: Transcript of Records, Transfer Credentials, Certification of Enrollment, GWA, Medium of Instruction, Grades
    description VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    processing_time VARCHAR(30),
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
'''