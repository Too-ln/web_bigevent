$.ajaxPrefilter(function(option){
    option.url='http://www.liulongbin.top:3007'+option.url
    if(option.url.indexOf('/my/')!==-1){
        option.headers={Authorization:localStorage.getItem('token') || ''}
    }

    option.complete=function(res){
        let {status,message}=res.responseJSON
        console.log(status,message);
        if(status===1  &&  message ==='身份认证失败！'){
            localStorage.removeItem('token')
            location.href='./login.html'
        }
    }
})

