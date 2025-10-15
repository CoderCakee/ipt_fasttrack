from django.db import models
from users.model import User
from requests.model import Request

# Create your models here.
class PaymentMethod(models.Model):
    method_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=50)

    def __str__(self):
        return self.name

'''
CREATE TABLE payment_methods (
    method_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL, -- includes: 'cash', 'check', 'bdo online', 'bdo otc', 'metrobank online', 'metrobank otc'
    description VARCHAR(50)
);
'''

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
    ]

    payment_id = models.AutoField(primary_key=True)
    request_id = models.ForeignKey(Request, on_delete=models.PROTECT)
    method_id = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)
    verified_by = models.ForeignKey(User, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    reference_no = models.CharField(max_length=50)
    verified_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment#{self.payment_id}"
'''
CREATE TABLE payments (
    payment_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    request_id INTEGER NOT NULL,
    method_id INTEGER NOT NULL,
    verified_by INTEGER,
    amount DECIMAL(10,2),
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    reference_no VARCHAR(50),
    verified_at DATETIME
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(request_id),
    FOREIGN KEY (method_id) REFERENCES payment_methods(method_id),
    FOREIGN KEY (verified_by) REFERENCES users(user_id)
);
'''