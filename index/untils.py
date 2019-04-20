def judge_filepath(file_type):
    img_list = ['bmp', 'jpg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf',
                'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']
    doc_list = ['txt', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx', 'lrc', 'wps', 'zip', 'rar', '7z', 'torrent', 'pdf']
    video_list = ['cd', 'ogg', 'mp3', 'asf', 'wma', 'wav', 'mp3pro', 'rm', 'mp4', 'real', 'ape', 'module', 'midi',
                  'vqf']
    procedure_list = ['exe', 'py', 'java', 'class', 'pyc', 'app', 'apk', 'bat']
    if file_type in img_list:
        file_path = 'img'
    elif file_type in doc_list:
        file_path = 'doc'
    elif file_type in video_list:
        file_path = 'video'
    elif file_type in procedure_list:
        file_path = 'procedure'
    else:
        file_path = 'others'
    return file_path


def format_size(old_size):
    if 1024 < old_size < 1024 * 1024:
        new_size = round(old_size / 1024, 2)
        return str(new_size) + 'KB'
    elif 1024 * 1024 < old_size < 1024 * 1024 * 1024:
        new_size = round(old_size / (1024 * 1024), 2)
        return str(new_size) + 'MB'
    elif old_size > 1024 * 1024 * 1024:
        new_size = round(old_size / (1024 * 1024 * 1024), 2)
        return str(new_size) + 'GB'
