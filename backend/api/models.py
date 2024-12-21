from django.db import models
from django.contrib.auth.models import User

#not modeli oluşturduk bu da veri tabanında Note tablosuna karşılık gelen ve tabloyu temsil eden bir python sınnıfı aslında.
#modelsı veritabanı tabloları tanımmlamak ve yönetebilmek için kullanıyoruz
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE,related_name="notes")
#foreign keyde kullanıcının diğer girdiği notlara falan ulaşmak çin kullanıyoruz 
#ondelete olduğunda kullanıcı silindiğinde mesela ona ait tüm notları silmek için cascade yapıyor
    def __str__(self):
        return self.title