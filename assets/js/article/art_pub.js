$(function () {
    const form = layui.form
    const initCate = () => {
        $.ajax({
            type:'GET',
            url:'/my/article/cates',
            success: res => {
                // console.log(res);
                if(res.status !== 0) return layer.msg('获取文章类别失败！')
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render('select')
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click',() => {
        $('#coverFile').click()
    })

    initCate()
    // 初始化富文本编辑器
    initEditor()

    $('#coverFile').change((e) => {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let art_state = '已发布'

    $('#The_draft').click(() => {
        art_state = '草稿'
    })

    $('.layui-form').submit(function(e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append('state',art_state)
        console.log(fd);

        $image
        .cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
        fd.append('cover_img', blob)
        publishArticle(fd)
        })
    })

    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg('发布文章失败！')
                // layer.msg('发布文章成功！')
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }
})