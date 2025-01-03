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
from video_analysis import video_analysis
import os 
from rest_framework import serializers
from .models import User  # Replace with your User model import
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import ffmpeg
from tempfile import NamedTemporaryFile
import subprocess
from django.contrib.auth import authenticate






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
        # Override the to_representation method to include the full URL of the profile picture
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

class NoteSerializer(serializers.ModelSerializer):
    author_full_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_profile_picture = serializers.ImageField(source='author.profile_picture', read_only=True)

    class Meta:
        model = Note
        fields = ['id', 'created_at', 'author', 'video', 'score', 'author_full_name', 'author_profile_picture']

    def create(self, validated_data):
        video_file = validated_data.get('video')

        # Check if video is valid using ffmpeg
        if video_file:
            try:
                # Save the video to a temporary file first to check its validity with ffmpeg
                with NamedTemporaryFile(delete=False) as temp_file:
                    temp_file.write(video_file.read())
                    temp_file.close()
                    
                    # Validate the video file with ffmpeg
                    ffmpeg.probe(temp_file.name)  # Check if the video is valid
                
                # Move the moov atom to the start of the video file using ffmpeg
                temp_video_path = temp_file.name  # Temporary path of the video
                output_video_path = os.path.join(settings.MEDIA_ROOT, 'fixed_' + video_file.name)  # New path for fixed video

                # Run ffmpeg to move the moov atom to the start
                subprocess.run(['ffmpeg', '-i', temp_video_path, '-movflags', 'faststart', output_video_path], check=True)

                # Open the fixed video file
                with open(output_video_path, 'rb') as f:
                    video_file_content = f.read()

                # Save fixed video to storage
                video_path = default_storage.save('media/videos/' + 'fixed_' + video_file.name, ContentFile(video_file_content))
                absolute_video_path = os.path.join(settings.MEDIA_ROOT, video_path)
                print(f"Video başarıyla kaydedildi: {absolute_video_path}")
                print(f"Video dosyasının URL'si: {video_path}")
                print(f"Video dosyasının tam yolu: {absolute_video_path}")
                
                # Generate the URL accessible from frontend
                video_url = settings.MEDIA_URL + 'videos/' + 'fixed_' + video_file.name

            except ffmpeg.Error as e:
                # Handle ffmpeg errors
                if "moov atom not found" in str(e.stderr):
                    raise serializers.ValidationError("Video dosyası bozuk veya eksik. Lütfen geçerli bir video yükleyin.")
                else:
                    raise serializers.ValidationError("Video dosyası geçerli değil veya başka bir hata oluştu.")

        else:
         video_url = None
         absolute_video_path = None

        note = Note.objects.create(**validated_data)


        # Save the video URL to the note
        if video_file:
            note.video_url = video_url
            note.save()

            # Calculate the video score and save it to the Note instance
            final_score = video_analysis(absolute_video_path)
            print(f"Video Analiz Sonucu: {final_score}")

            note.score = final_score
            note.save()

        return note
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email", None)
        if email:
            attrs["username"] = email  # JWT, username alanını arar, email'e yönlendirin
        return super().validate(attrs)

@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Kullanıcıyı authenticate et
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            # Token'ları al
            tokens = get_tokens_for_user(user)
            
            # Başarılı giriş yanıtı
            return Response({
                'access_token': tokens['access'],
                'refresh_token': tokens['refresh'],
                'user': {
                    'id': user.id,
                    'email': user.email,
                }
            }, status=200)
        else:
            # Kimlik doğrulama başarısızsa hata mesajı
            return Response({'detail': 'Invalid credentials'}, status=401)
    
    # Serializer geçerli değilse hata mesajı döndür
    return Response(serializer.errors, status=400)