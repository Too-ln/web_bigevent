$(function(){
    let q={
        pagenum:1,
        pagesize:2,
        cate_id:'',
        state:''
    }
    const layer=layui.layer
    const form = layui.form
    const laypage = layui.laypage;
    function initZero(t){
        return t<10?"0"+t:t
    }

    template.defaults.imports.fliterTime=function(date){
        const dt =new Date(date)

        let y=dt.getFullYear()
        let m=initZero(dt.getMonth()+1)
        let d=initZero(dt.getDate())

        let hh=initZero(dt.getHours)
        let mm=initZero(dt.getMinutes())
        let ss=initZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    initTable()
    initCate()
    function initTable(){
        $.ajax({
            method:'GET',
            url:"/my/article/list",
            data:q,
            success:function(res){
                if(res.status!==0) return layer.msg('获取文章列表失败!')
                let htmlStr=template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }        
        })
    }

    function initCate() {
        $.ajax({
          method: 'GET',
          url: '/my/article/cates',
          success: function(res) {
            if (res.status !== 0) {
              return layer.msg('获取分类数据失败！')
            }
            // 调用模板引擎渲染分类的可选项
            let htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr)
            // 通过 layui 重新渲染表单区域的UI结构
            form.render()
          }
        })
      }

      $('#form-search').on('submit',function(e){
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id=cate_id
        q.state=state
        initTable()
      })

      function renderPage(total){
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total, //数据总数，从服务端得到
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                q.pagenum=obj.curr
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize=obj.limit
                //首次不执行
                if(!first){
                    initTable()
                  //do something
                }
              }
        
          });        
      }
    $('tbody').on('click','.btn-del',function(){
        let id=$(this).data('id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'get',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0) return layer.msg('删除文章失败！')
                    layer.msg('删除文章成功！')
                    initTable()
                    layer.close(index);
                }
            })
        })
    })
})