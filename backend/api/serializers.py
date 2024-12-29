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
from backend.video_analysis import process_video


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


from rest_framework import serializers
from .models import User  # Replace with your User model import
from django.conf import settings

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'profile_picture']

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

    def to_representation(self, instance):
        # Override the `to_representation` method to include the full URL of the profile picture
        representation = super().to_representation(instance)
        if instance.profile_picture:
            # Ensure that the profile picture URL is accessible via the MEDIA_URL
            representation['profile_picture'] = settings.MEDIA_URL + str(instance.profile_picture)
        return representation

    

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


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class NoteSerializer(serializers.ModelSerializer):
    author_full_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_profile_picture = serializers.ImageField(source='author.profile_picture', read_only=True)


    class Meta:
        model = Note
        fields = ['id','created_at', 'author', 'video', 'score','author_full_name', 'author_profile_picture']

    def create(self, validated_data):
        video_file = validated_data.get('video')
        # Create the Note instance with validated data
        note = Note.objects.create(**validated_data)
        
        if video_file:
            # Save the video file to the default storage and get the file path
            video_path = default_storage.save('media/videos/' + video_file.name, ContentFile(video_file.read()))
            print(f"Video başarıyla kaydedildi: {video_path}")  # Dosya kaydedildi mi?
            print(f"Video dosyasının URL'si: {video_path}")


            # Process the video to get the classification score
            score = process_video(video_path)  # Assume this function processes the video and returns the score
            # Assign the classification score to the Note instance
            note.score = score  # Ensure 'score' is the correct field name in the model
            # Save the Note instance with the classification score
            note.save()

        return note


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email", None)
        if email:
            attrs["username"] = email  # JWT, username alanını arar, email'e yönlendirin
        return super().validate(attrs)
