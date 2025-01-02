from django.db import models
from django.contrib.auth.models import User

#not modeli oluşturduk bu da veri tabanında Note tablosuna karşılık gelen ve tabloyu temsil eden bir python sınnıfı aslında.
#modelsı veritabanı tabloları tanımmlamak ve yönetebilmek için kullanıyoruz
class Note(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    video = models.FileField(upload_to='videos/', null=True, blank=True)  # Video upload field
    score = models.FloatField(null=True, blank=True)


    def __str__(self):
        return f"Note created at {self.created_at.strftime('%Y-%m-%d %H:%M:%S')} with score {self.score}"  # Return another attribute
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'

    