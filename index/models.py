from django.db import models
from django.conf import settings


# Create your models here.


# class FileInfo(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=True)
#     main_dir = models.CharField(max_length=512, verbose_name='文件主目录')
#     file_path = models.CharField(max_length=512, verbose_name='文件路径')
#     file_name = models.CharField(max_length=128, verbose_name='文件名')
#     update_time = models.DateTimeField(verbose_name='上传时间')
#     file_type = models.CharField(max_length=32, verbose_name='文件类型')
#     file_size = models.CharField(max_length=16, verbose_name='文件大小')
#     full_path = models.CharField(max_length=512, verbose_name='文件总路径')
#
#     def __str__(self):
#         return "user:{},main_dir:{},file_path:{},file_name:{},update_time:{},file_type:{},file_size:{},full_path:{}".format(
#             self.user, self.main_dir, self.file_path, self.file_name, self.update_time, self.file_type, self.file_size,
#             self.full_path
#         )

class FileInfo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=True)
    file_path = models.CharField(max_length=128, verbose_name='存储路径')
    file_name = models.CharField(max_length=128, verbose_name='文件名')
    update_time = models.DateTimeField(verbose_name='上传时间')
    file_type = models.CharField(max_length=32, verbose_name='文件类型')
    file_size = models.CharField(max_length=16, verbose_name='文件大小')
    belong_folder = models.CharField(max_length=64, verbose_name='所属文件夹')


class FolderInfo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=True)
    update_time = models.DateTimeField(verbose_name='创建时间')
    belong_folder = models.CharField(max_length=64, verbose_name='所属文件夹')
    folder_name = models.CharField(max_length=64, verbose_name='文件夹名')
