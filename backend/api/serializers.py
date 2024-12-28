from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.urls import reverse


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},  
        }

    def create(self, validated_data):
        # Assign email as the username before creating the user
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user

        
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save(is_active=False)  # Save user but don't activate them

        # Generate email verification token and UID
        uid = urlsafe_base64_encode(force_bytes(user.pk))  # User ID encoded
        token = default_token_generator.make_token(user)  # Token generation

        # Generate verification URL
        verification_url = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        full_url = f'{settings.SITE_URL}{verification_url}'

        # Send verification email
        send_mail(
            'Email Verification',  # Subject
            f'Please verify your email by clicking the following link: {full_url}',  # Body
            'detectaiteam@outlook.com',  # From email address
            [user.email],  # Recipient email
            fail_silently=False,
        )

        return Response(
            {"message": "Registration successful. Please check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            username=validated_data['email'],
            password=validated_data['password']
        )
        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        # İşlem başarılı
        pass
    else:
        # Hata mesajını dön
        return Response(serializer.errors, status=400)


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author', 'video']
        extra_kwargs = {'author': {'read_only': True}}

    def create(self, validated_data):
        video_file = validated_data.get('video')
        # Save the note and handle file upload
        note = Note.objects.create(**validated_data)
        if video_file:
            # Optionally, handle additional logic for the video file (e.g., storing or processing)
            pass
        return note

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email", None)
        if email:
            attrs["username"] = email  # JWT, username alanını arar, email'e yönlendirin
        return super().validate(attrs)
