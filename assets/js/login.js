$(function() {
    $('#link_reg').on('click',() => {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click',() => {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 引入form
    const form = layui.form

    //自定义校验规则
    form.verify({
        // 自定义一个叫 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验两次密码是否一致的规则
        repwd: (value) => {
            // 1.拿到确认密码框里的值，也就是value
            // 2.拿到密码框的值
            // 3.判断两个值是否相等
            // 4.如果判断失败,则return一个提示消息即可
            const pwd = $(".reg-box [name=password").val();
            if(pwd !== value) return "两次密码不一致"
        },  
    });

     // 获取 layui 弹窗
const layer = layui.layer;
// 设置请求根路径
// const baseUrl = "http://www.liulongbin.top:3007";

// 监听注册表单，发送注册请求
$("#form_reg").on("submit", (e) => {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url:"/api/reguser",
        data: {
            username: $("#form_reg [name=username").val(),
            password: $("#form_reg [name=password").val(),
        },
        success: (res) => {
            if (res.status !== 0) return layer.msg('注册失败！');
            layer.msg("注册成功！");
            // 注册成功后跳转到登录界面
            $("#link_login").click();
        },
    });
});

// 登录功能
$('#form_login').on('submit',function(e) {
    e.preventDefault();
    $.ajax({
        type:'POST',
        url:'/api/login',
        data:$(this).serialize(),
        success:res => {
            if(res.status !== 0) return layer.msg('登陆失败！')
            layer.msg('登录成功！')
            localStorage.setItem('token',res.token)
            location.href = '/index.html'
            // console.log(res);
        }
    })
})
})