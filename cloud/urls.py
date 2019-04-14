"""cloud URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from index import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index),
    path('delete_file/', views.delete_file),
    path('download_file/', views.download_file),
    path('upload_file/', views.upload_file),
    path('type/', views.type),
    path('search/', views.search),
    path('login/', views.login),
    path('logout/', views.logout),
    path('register/', views.register),
]
handler404=views.page_not_found
handler500=views.page_error