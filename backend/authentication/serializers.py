from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists")
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = User.objects.get(id=user_id)
            return {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")


# Login Serializer
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']   

    def validate(self, data):
        user = authenticate(
            username=data['email'],
            password=data['password']
        )
        # If user is None, then the credentials are incorrect
        if user is None:
            raise serializers.ValidationError("Incorrect Credentials")
        return user

# Current User Serializer
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']
    
    def validate(self, data):
        if self.context['request'].user.is_authenticated:
            return data
        else:
            raise serializers.ValidationError("User is not authenticated")