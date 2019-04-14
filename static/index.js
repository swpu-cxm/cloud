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
                url: "/type/?file_type=" + type,
                success: function (data) {
                    var tr = $('<tr></tr>');
                    var all_tr = '';
                    for (var i = 0; i < data.length; i++) {
                        var tr = '<tr></tr><td><a href="../static' + data[i].full_path + '">' + data[i].file_name + '</a></td>\n' +
                            '<td>' + data[i].file_size + '</td>\n' +
                            '<td>' + data[i].update_time + '</td>\n' +
                            '<td><a href="/download_file/?file_path=' + data[i].full_path + '">下载</a>\n' +
                            '&nbsp;&nbsp;&nbsp;\n' +
                            '<a href="/delete_file/?file_path=' + data[i].full_path + '">删除</a>\n' +
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
                        var tr = '<tr></tr><td><a href="../static' + data[i].full_path + '">' + data[i].file_name + '</a></td>\n' +
                            '<td>' + data[i].file_size + '</td>\n' +
                            '<td>' + data[i].update_time + '</td>\n' +
                            '<td><a href="/download_file/?file_path=' + data[i].full_path + '">下载</a>\n' +
                            '&nbsp;&nbsp;&nbsp;\n' +
                            '<a href="/delete_file/?file_path=' + data[i].full_path + '">删除</a>\n' +
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
    }
);



