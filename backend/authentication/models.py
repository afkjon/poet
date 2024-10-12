from django.db import models
from django.contrib.auth.models import AbstractUser

# User Model
class User(AbstractUser):
    display_name = models.CharField(max_length=30, blank=True, null=True) 
    bio = models.TextField(max_length=500, blank=True, null=True)
    location = models.CharField(max_length=30, blank=True, null=True)

    def __str__(self):
        return self.email
    
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='custom_user_set', 
        blank=True
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )



# Refresh Token Model
class RefreshToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

# Blacklisted Token Model
class BlacklistedToken(models.Model):
    token = models.CharField(max_length=255)
    blacklisted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

# Session Model
class Session(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_data = models.TextField()
    session_key = models.CharField(max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.session_key

# Session Key Model
class SessionKey(models.Model):
    key = models.CharField(max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.key
