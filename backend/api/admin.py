from django.contrib import admin
from .models import Note
from django.utils.html import format_html


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id','created_at', 'author', 'video_link','score')
    list_filter = ['created_at']  # Enable filtering by created_at

    def video_link(self, obj):
        if obj.video:
            return format_html('<a href="{}" target="_blank">View Video</a>', obj.video.url)
        return "No Video"

    video_link.short_description = 'Video'

