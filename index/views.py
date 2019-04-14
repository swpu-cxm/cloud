from django.shortcuts import render, redirect
from index import models
from django.http import FileResponse, JsonResponse
import os
from index.untils import judge_filepath, format_size
from django.utils import timezone
from django.utils.http import urlquote
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

# Create your views here.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@login_required
def index(request):
    user = request.user
    main_dir = '/' + str(user)
    file_list = models.FileInfo.objects.filter(main_dir=main_dir)
    return render(request, 'index.html', {'file_list': file_list, 'username': str(user)})


@login_required
def delete_file(request):
    user = str(request.user)
    file_path = request.GET.get('file_path')
    file_name = file_path.split('/')[-1]
    main_dir = '/' + user
    models.FileInfo.objects.get(file_name=file_name, main_dir=main_dir).delete()
    try:
        os.remove(BASE_DIR + '/static' + file_path)
    except Exception as e:
        pass
    return redirect('/')


@login_required
def download_file(request):
    file_path = request.GET.get('file_path')
    file_name = file_path.split('/')[-1]
    file_dir = BASE_DIR + '/static' + file_path
    file = open(file_dir, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename={}'.format(urlquote(file_name))
    return response


@login_required
def upload_file(request):
    if request.method == "POST":
        user_name = str(request.user)
        user_obj = User.objects.get(username=user_name)
        file_obj = request.FILES.get('file')
        file_type = file_obj.name.split('.')[-1].lower()
        file_path = judge_filepath(file_type)
        update_time = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        file_size = format_size(file_obj.size)
        file_name = file_obj.name
        main_dir = '/' + str(user_name)
        full_path = main_dir + file_path + file_name
        models.FileInfo.objects.create(user_id=user_obj.id, main_dir=main_dir, file_path=file_path,
                                       file_name=file_name, update_time=update_time, file_size=file_size,
                                       file_type=file_type, full_path=full_path)
        with open(BASE_DIR + '/static' + full_path, 'wb+') as f:
            for chunk in file_obj.chunks():
                f.write(chunk)
        return redirect('/')


@login_required
def type(request):
    file_type = request.GET.get('file_type')
    file_list = []
    user = request.user
    main_dir = '/' + str(user)
    if file_type == 'all':
        file_obj = models.FileInfo.objects.filter(main_dir=main_dir)
    else:
        file_obj = models.FileInfo.objects.filter(file_path="/{}/".format(file_type), main_dir=main_dir)
    for file in file_obj:
        file_list.append({'main_dir': file.main_dir, 'file_path': file.file_path, 'file_name': file.file_name,
                          'update_time': str(file.update_time), 'file_size': file.file_size,
                          'file_type': file.file_type,
                          'full_path': file.full_path})
    return JsonResponse(file_list, safe=False)


@login_required
def search(request):
    file_type = request.GET.get('file_type')
    file_name = request.GET.get('file_name')
    file_list = []
    user = request.user
    main_dir = '/' + str(user)
    if file_type == 'all':
        file_obj = models.FileInfo.objects.filter(file_name__icontains=file_name, main_dir=main_dir)
    else:
        file_obj = models.FileInfo.objects.filter(file_path="/{}/".format(file_type), file_name__icontains=file_name,
                                                  main_dir=main_dir)
    for file in file_obj:
        file_list.append({'main_dir': file.main_dir, 'file_path': file.file_path, 'file_name': file.file_name,
                          'update_time': str(file.update_time), 'file_size': file.file_size,
                          'file_type': file.file_type,
                          'full_path': file.full_path})
    return JsonResponse(file_list, safe=False)


def login(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    elif request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = auth.authenticate(username=username, password=password)
        if user:
            auth.login(request, user)
            return redirect('/')
        else:
            return render(request, 'login.html', {'info': '用户名或密码错误'})


def register(request):
    if request.method == 'GET':
        return render(request, 'register.html')
    elif request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        repassword = request.POST.get('repassword')
        user_path = os.path.join(BASE_DIR, 'static', username)
        if password == repassword:
            try:
                User.objects.create_user(username=username, password=password)
            except Exception as e:
                return render(request, 'register.html', {'info': '用户已存在'})
            file_type_list = ['doc', 'img', 'procedure', 'video', 'others']
            os.mkdir(user_path)
            for file_type in file_type_list:
                os.mkdir(os.path.join(user_path, file_type))
        else:
            return render(request, 'register.html', {'info': '两次密码不一致'})
        return redirect('/login')


def logout(request):
    auth.logout(request)
    return redirect('/')


def page_not_found(request):
    return render(request, '404.html')


def page_error(request):
    return render(request, '500.html')
