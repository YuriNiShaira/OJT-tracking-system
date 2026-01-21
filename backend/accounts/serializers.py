from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'role', 
                  'first_name', 'last_name', 'phone', 'student_id', 'course', 'year_level',
                  'company_name', 'company_address', 'company_description']
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
            
        # Only validate if role exists
        role = data.get('role')
        
        if role == 'student':
            if not data.get('course'):
                raise serializers.ValidationError({"course": "Course is required for students"})
        elif role == 'company':
            # For companies, don't validate course field at all
            # Remove it from data if it's empty
            if 'course' in data and (data['course'] == '' or data['course'] is None):
                data.pop('course', None)  # Remove it completely
            
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled")
        
        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 
                  'phone', 'profile_image', 'is_verified', 'student_id', 'course', 
                  'year_level', 'company_name', 'company_address', 'company_description',
                  'bio', 'date_joined']
        read_only_fields = ['id', 'username', 'role', 'is_verified', 'date_joined']
    
    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value