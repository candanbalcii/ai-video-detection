from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class NoteListCreate(generics.ListCreateAPIView): #tm notları list edecek ya da yeni not oluşturacak
    serializer_class = NoteSerializer
    #serializer when we pass to it different data it will tell us if its valid or not
    permission_classes = [IsAuthenticated]

    #yukarıdak generic list viewda aslında any data thats required to create the note will be accepted and passed into serializer and 
    #serializer chechk edecek against all of the different fields on the model onu accurate mı diye mesela title max length üzerinde mi vsvs

    def get_queryset(self):
        user = self.request.user #user objecti veriyor direkt authenticate olmuş
        return Note.objects.filter(author=user )
    #someone elsein notunu okuyamazsın sadece kendinin

    def perform_create(self,serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

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


