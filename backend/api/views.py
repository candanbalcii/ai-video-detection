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

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return notes that belong to the authenticated user
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        # Perform the actual creation of a note with the authenticated user
        if serializer.is_valid():
            # Save the note with the current authenticated user as the author
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

    def create(self, request, *args, **kwargs):
        """
        Overriding the `create` method to handle video file upload.
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
        # The serializer will handle the username logic, so no need for additional checks here.
        super().perform_create(serializer)


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
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        raise Http404("Invalid verification link")

    if default_token_generator.check_token(user, token):
        user.is_active = True  # Kullanıcıyı aktif et
        user.save()
        return Response({"message": "Email successfully verified!"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
