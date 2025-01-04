from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from rest_framework_simplejwt.views import TokenObtainPairView
from api.serializers import CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from .models import UserProfile  # Import the UserProfile model
import os
from video_analysis import video_analysis



class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return notes that belong to the authenticated user
        user = self.request.user
        return Note.objects.filter(author=user)

   
    def create(self, request, *args, **kwargs):
        """
        Overriding the create method to handle video file upload.
        This ensures that the video file is correctly handled as part of the form data.
        """
        # Handling the incoming request as a multipart form-data (to support video upload)
        data = request.data
        data['author'] = request.user.id  # Adding the authenticated user as the author

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user 
        return Note.objects.filter(author=user )
    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Kullanıcıyı oluştur
        user = serializer.save()
        
        # Kullanıcı için bir UserProfile oluştur
        UserProfile.objects.create(user=user)

        # Gerekirse, başka başlangıç işlemleri yapılabilir


class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user
        # Update user fields (e.g., first name, last name, email)
        user.first_name = request.data.get('first_name', user.first_name)
        user.last_name = request.data.get('last_name', user.last_name)
        user.email = request.data.get('email', user.email)
        user.save()

        # Handle profile picture update
        if 'profile_picture' in request.FILES:
            profile_picture = request.FILES['profile_picture']
            user_profile, created = UserProfile.objects.get_or_create(user=user)
            user_profile.profile_picture = profile_picture
            user_profile.save()

        # Get the profile picture URL
        profile_picture_url = user_profile.profile_picture.url if user_profile.profile_picture else None

        return Response({
            "message": "Profile updated successfully",
            "profile_picture": profile_picture_url
        }, status=status.HTTP_200_OK)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        pass
    else:
        return Response(serializer.errors, status=400)


class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user 
        return Note.objects.filter(author=user )
    
class NoteListAll(generics.ListAPIView):
    queryset = Note.objects.all()  # Tüm notları döndür
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]  # Kimlik doğrulama gerektirme
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        # Kullanıcıyı kaydet ancak aktif etme
        user = serializer.save(is_active=False)

        # Kullanıcı için UID ve Token oluştur
        uid = urlsafe_base64_encode(force_bytes(user.pk))  # User ID encoded
        token = default_token_generator.make_token(user)  # Token generation

        # Doğrulama URL'si oluştur
        verification_url = reverse('verify_email', kwargs={'uidb64': uid, 'token': token})
        full_url = f'{settings.SITE_URL}{verification_url}'

        # HTML e-posta içeriği
        subject = 'Email Verification'
        message = render_to_string('account/verification_email.html', {
            'user': user,
            'verification_url': full_url,
        })

        # E-posta gönderme
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )

        return Response(
            {"message": "Registration successful. Please check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)  # UserProfile modelinden profili al
            profile_picture_url = user_profile.profile_picture.url if user_profile.profile_picture else None
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile does not exist."}, status=404)

        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_picture': profile_picture_url,
        })
    