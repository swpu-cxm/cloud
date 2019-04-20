$(document).ready(function () {


        //排序js开始
        $('th').each(function (i) {
                var sort_direction = 1; //排序标志，1为升序，-1为降序
                $(this).click(function () {
                        if (sort_direction == 1) {
                            sort_direction = -1;
                        } else {
                            sort_direction = 1;
                        }
                        //获得行数组
                        var trarr = $('table').find('tbody > tr').get();
                        //数组排序
                        trarr.sort(function (a, b) {
                                var col1 = $(a).children('td').eq(i).text().toUpperCase();
                                var col2 = $(b).children('td').eq(i).text().toUpperCase();
                                return (col1 < col2) ? -sort_direction : (col1 > col2) ? sort_direction : 0;
                            }
                        );
                        $.each(trarr, function (i, row) {
                                //将排好序的数组重新填回表格
                                $('tbody').append(row);
                            }
                        );
                    }
                );
            }
        );
        //排序js结束

        //分类ajax开始
        $(".classify_link").click(function (event) {
            var type = event.target.id;
            var $selector = $(this).attr("data-target");
            var val = $(this).text();
            $.ajax({
                type: "get",
                dataType: "json",
                url: "/file_type/?file_type=" + type,
                success: function (data) {
                    var tr = $('<tr></tr>');
                    var all_tr = '';
                    var pwd = $('#pwd').text();
                    for (var i = 0; i < data.length; i++) {
                        var tr = '<tr></tr><td style="text-align: left"><a href="/static/' + data[i].file_path + '"><i class="fa fa-file fa-lg"></i> ' + data[i].file_name + '</a></td>\n' +
                            '<td>' + data[i].file_size + '</td>\n' +
                            '<td>' + data[i].update_time + '</td>\n' +
                            '<td><a class="btn btn-success" href="/download_file/?file_path=' + data[i].file_path + '"><i class="fa fa-cloud-download fa-lg" aria-hidden="true"></i> 下载</a> ' +
                            '<a class="btn btn-danger"  href="/delete_file/?pwd=' + pwd + '&file_path=' + data[i].file_path + '"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> 删除</a> \n' +
                            '</td></tr>'
                        all_tr = all_tr + tr;
                    }
                    $('#myTable tbody').html(all_tr);
                }
            })
        })
        //分类ajax结束

        //搜索ajax开始
        $(".search_link").click(function (event) {
            var file_name = $(" .search-input").val();
            var type = event.target.name;
            //var $selector = $(this).attr("data-target");
            var val = $(this).text();
            $.ajax({
                type: "get",
                dataType: "json",
                url: "/search/?file_name=" + file_name + "&file_type=" + type,
                success: function (data) {
                    var tr = $('<tr></tr>');
                    var all_tr = '';
                    for (var i = 0; i < data.length; i++) {
                        var tr = '<tr></tr><td style="text-align: left"><a href="/static/' + data[i].file_path + '"><i class="fa fa-file fa-lg"></i> ' + data[i].file_name + '</a></td>\n' +
                            '<td>' + data[i].file_size + '</td>\n' +
                            '<td>' + data[i].update_time + '</td>\n' +
                            '<td><a class="btn btn-success" href="/download_file/?file_path=' + data[i].file_path + '"><i class="fa fa-cloud-download fa-lg" aria-hidden="true"></i> 下载</a>\n' +
                            '&nbsp;&nbsp;&nbsp;\n' +
                            '<a class="btn btn-danger"  href="/delete_file/?pwd=' + pwd + '&file_path=' + data[i].file_path + '"><i class="fa fa-trash fa-lg" aria-hidden="true"></i> 删除</a>\n' +
                            '</td></tr>'
                        all_tr = all_tr + tr;
                    }
                    $('#myTable tbody').html(all_tr);
                }
            })
        })
        //搜索文件ajax结束

        //导航栏动态效果切换
        var ul = document.querySelector("ul");
        var N = ul.firstElementChild;
        ul.addEventListener("click", clickHandler);

        function clickHandler(e) {
            if (e.target instanceof HTMLUListElement) return;
            if (e.target instanceof HTMLLIElement) return;
            if (N) {
                N.className = "";
            }
            N = e.target.parentElement;
            N.className = "active";
        }

        $(".myFileUpload").change(function () {
            var arrs = $(this).val().split('\\');
            var filename = arrs[arrs.length - 1];
            $(".show").html(filename);
        });

        //上传文件开始
        $("#upload").click(function () {
            //创建FormData对象，初始化为form表单中的数据。需要添加其他数据可使用formData.append("property", "value");
            $('.progress').show();
            var formData = new FormData();

            //var formData = new FormData($('form')[0]);
            var name = $("input").val();

            formData.append("file", $("#file")[0].files[0]);

            formData.append("name", name);

            formData.append('file_path', $('#pwd').text());

            //ajax异步上传
            $.ajax({
                url: "/upload_file/",
                type: "POST",
                dataType: "json",
                data: formData,
                headers: {"X-CSRFToken": $.cookie('csrftoken')},
                xhr: function () { //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数

                    myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) { //检查upload属性是否存在
                        //绑定progress事件的回调函数
                        myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                    }
                    return myXhr; //xhr对象返回给jQuery使用
                },
                success: function (result) {

                },
                contentType: false, //必须false才会自动加上正确的Content-Type
                processData: false  //必须false才会避开jQuery对 formdata 的默认处理
            });
        })

        //上传进度回调函数：
        function progressHandlingFunction(e) {
            if (e.lengthComputable) {
                //$('.progress > div').attr({value: e.loaded, max: e.total}); //更新数据到进度条
                var percent = e.loaded / e.total * 100;
                $('#prog').html(percent.toFixed(2) + "%");
                $('#prog').css('width', percent.toFixed(2) + "%");
            }
        }

        //上传文件结束

        //关闭模态框事件
        $('#myModal').on('hidden.bs.modal', function (e) {
            $('.progress').hide();
            window.location.reload();
        })
        //关闭模态框事件

        // //为文件添加图标开始
        //
        // $("tbody").on('click', '.dir', function (event) {
        //     var pdir = event.target.name;
        //     //var type = event.target.className.split(" ")[0];
        //     $.ajax({
        //         type: "get",
        //         dataType: "json",
        //         url: "/folder/?pdir=" + pdir,
        //         success: function (data) {
        //             var all_tr = '';
        //             for (var i = 0; i < data.length; i++) {
        //                 if (data[i].is_file) {
        //                     var td1 = '<td style="text-align: left"><a href="javascript:void(0);" ><i class="fa fa-file fa-lg"></i>' + data[i].file_name + '</a></td>';
        //                     var td2 = '<td>'+ data[i].file_size +'</td>';
        //                 } else {
        //                     var td1 = '<td style="text-align: left"><a href="javascript:void(0);" class="dir" name="' + data[i].file_name + '"><i class="fa fa-folder-o fa-lg"></i>' + data[i].file_name + '</a></td>';
        //                     var td2 = '<td>---</td>';
        //                 }
        //                 var td3 = ' <td>'+ data[i].update_time +'</td>';
        //                 var td4 = '<td> <a href="/download_file/?file_path={{ file.full_path }}">下载</a> &nbsp;&nbsp;&nbsp;<a href="/delete_file/?file_path={{ file.full_path }}">删除</a> </td>';
        //                 all_tr = all_tr + '<tr>' + td1 + td2 + td3 + td4 + '</tr>';
        //             }
        //             $('#myTable tbody').html(all_tr);
        //         }
        //     })
        // })
        //
        // //为文件添加图标结束
    }
);



