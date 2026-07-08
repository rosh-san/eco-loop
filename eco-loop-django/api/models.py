from django.db import models

class PickupTicket(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
    ]

    item_type = models.CharField(max_length=100, help_text="e.g., Laptop, Smartphone, Fridge")
    quantity = models.IntegerField(default=1)
    address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_type} ({self.status})"