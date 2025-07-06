from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    member_id = models.CharField(max_length=50, unique=True)
    points = models.IntegerField(default=0)
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('inactive', 'Inactive')],
        default='active'
    )
    location = models.CharField(max_length=255, blank=True)
    avatar = models.URLField(blank=True)

    def __str__(self):
        return f"{self.username} ({self.member_id})"


class Store(models.Model):
    CATEGORY_CHOICES = [
        ('restaurant', 'Restaurant'),
        ('retail', 'Retail'),
        ('service', 'Service'),
        ('entertainment', 'Entertainment'),
        ('health', 'Health'),
        ('education', 'Education'),
    ]
    
    PRICE_RANGE_CHOICES = [
        ('budget', 'Budget'),
        ('moderate', 'Moderate'),
        ('expensive', 'Expensive'),
        ('luxury', 'Luxury'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('pending', 'Pending'),
        ('suspended', 'Suspended'),
    ]

    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    registration_date = models.DateTimeField(auto_now_add=True)
    point_rate = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monthly_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='restaurant')
    price_range = models.CharField(max_length=20, choices=PRICE_RANGE_CHOICES, default='moderate')
    features = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    hours = models.CharField(max_length=255, blank=True)
    biid_partner = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class PointTransaction(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit', 'Credit Card'),
        ('digital', 'Digital Payment'),
        ('bank', 'Bank Transfer'),
    ]
    
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_transactions')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='point_transactions')
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    points_issued = models.IntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['-transaction_date']

    def __str__(self):
        return f"{self.transaction_id} - {self.user.username} - {self.points_issued} points"
