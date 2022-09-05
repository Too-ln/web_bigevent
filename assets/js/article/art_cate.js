$(function(){
    const layer=layui.layer
    const form=layui.form
    let indexAdd=null
    let indexEdit=null

    initAtrCateList()
    function initAtrCateList(){
        $.ajax({
            type:'get',
            url:'/my/article/cates',
            success:function(res){
                let htmlStr=template('tpl',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    $('#btnAdd').on('click',function(){
        indexAdd= layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
          });  
    })

    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:'post',
            url:'/my/article/addcates',
            data: $(this).serialize(),
            success:function(res){
                if(res.status!==0) return layer.msg('新增分类失败!')
                initAtrCateList()
                layer.msg('新增分类成功!')
                layer.close(indexAdd)
            }
        })
    })

    $('tbody').on('click','#btn-edit',function(){
        indexEdit= layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
          });  

        let id =$(this).data('id')
        
        $.ajax({
            method:'get',
            url:'/my/article/cates/'+id,
            success:function(res){
                if(res.status!==0) return layer.msg('获取分类失败!')
                form.val('form-edit',res.data)
            }
        })
    })

    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data: $(this).serialize(),
            success:function(res){
                if(res.status!==0) return layer.msg('修改分类失败!')
                initAtrCateList()
                layer.msg('修改分类成功!')
                layer.close(indexEdit)
            }
        })
    })
    $('tbody').on('click','#btn-del',function(){
        let id =$(this).data('id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'get',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0) return layer.msg('删除分类失败!')
                    layer.msg('删除分类成功!')
                    layer.close(index);

                }
            })
          });
    })
})