from django.db import models

# Create your models here.
class PaymentMethod(models.Model):
    method_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=30, null=False)
    description = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'payments'
        db_table = 'payment_methods'

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
    request_id = models.ForeignKey(
        'requests.Request',
        on_delete=models.PROTECT,
        null=False,
        db_column='request_id',
    )
    method_id = models.ForeignKey(
        PaymentMethod,
        on_delete=models.PROTECT,
        null=False,
        db_column='method_id',
    )
    verified_by = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='user_id'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    reference_no = models.CharField(max_length=50)
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment#{self.payment_id}"

    class Meta:
        app_label = 'payments'
        db_table = 'payments'

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