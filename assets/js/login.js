$(function(){
    //去注册
    $('#link_reg').on('click',function(){
        $(this).parents('.login-box').hide().siblings('.reg-box').show()
    })

    //去登陆
    $('#link_login').on('click',function(){
        $(this).parents('.reg-box').hide().siblings('.login-box').show()
    })

    //从layui中获取form对象
    const form = layui.form
    const layer = layui.layer;
    //通过 form.verify()函数自定义校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        repass:function(value){
           let pwd= $('.reg-box [name=password]').val()
           if(pwd!==value){
            return '两次密码不一致'
           }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault();
        const username= $('.reg-box [name=username]').val().trim()
        const password=$('.reg-box [name=password]').val()
        $.post('/api/reguser',{username:username,password:password},function(res){
            if(res.status !==0) return layer.msg(res.message);
            layer.msg('注册成功，请登录！');
            $('#link_login').click()
        })
    })
    //监听登陆表单的提交事件
    $('#form_login').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type:'post',
            url:"/api/login",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0) return layer.msg(res.message);
                layer.msg('登录成功！');
                localStorage.setItem('token',res.token)
                location.href='./index.html'
            }
        })
    })
})