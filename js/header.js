$(()=>{
    //判断登录 loadStatus
    function loadStatus(){
        $.ajax({
            type:"get",
            url:"data/routes/users/isLogin.php",
            success:function(data){
                //console.log(data);
                var $loginList=$("#loginList");
                var $welcomeList=$("#welcomeList");
                getCart();
                if(data.ok==1){
                    $loginList.hide();
                    $welcomeList.show();
                    $welcomeList.find("#avatar").attr("src",data.avatar);
                    $welcomeList.find("#uname").html(data.uname);
                }else{
                    $loginList.show();
                    $welcomeList.hide();
                }

            },
            error:function(){
                alert("网络故障请重试!");
            }
        })
    }
    function getCart(){
        $.ajax({
            type:"get",
            url:"data/routes/cart/getCart.php",
            success:function(data){
                for(var i=0,count=0;i<data.length;i++){
                    count+=parseInt(data[i].count);
                }
                $("#welcomeList .cart_count").html(count);
            },
            error:function(){
                alert("未获取到购物车数据,请登录");
            }
        });
    }
    //加载页头
    $("#header").load("header.html",()=>{
        /*原理:$("#header").html(xhr.responseText);*/
        /*如果url中有kw参数,就读取kw参数到txtSearch文本中*/
        if(location.search){
            $("#txtSearch").val(decodeURI(location.search.split("=")[1]));
        }
        /*为search按钮添加单击事件,跳转到商品列表页*/
        //查找data-trigger属性为search的a绑定单击事件
        $("[data-trigger=search]").click(()=>{
            //获得id为txtSearch的内容,去掉开头和结尾的空格保存在变量kw中
            var kw=$("#txtSearch").val().trim();
            if(kw!==""){//如果kw!==""
                location="products.html?kw="+kw;//用location跳转到products.html?kw=kw
            }
        });
        loadStatus();
        //注销
        $("#logout").click(()=>{
            $.ajax({
                type:"get",
                url:"data/routes/users/logout.php",
                dataType:"text",
                success:function(){location.reload();},
                error:function(){alert("网络故障请检查!");}
            })
        });
    });
    //判断滑动距离固定页头
    $(window).scroll(()=>{
        var scrollTop=$(window).scrollTop();
        //console.log(scrollTop);
        if(scrollTop>=100){
            $("#header").addClass("fixed_nav");
        }else{
            $("#header").removeClass("fixed_nav");
        }
    });
});

/*
   //搜索帮助:
            var $txtSearch=$("#txtSearch"),
                $shelper=$("#shelper");
            $txtSearch.keyup(e=>{
                if(e.keyCode!=13){//回车
                    if(e.keyCode==40){//向下
                        if(!$shelper.is(":has(.focus)")){
                            $shelper.children().first().addClass("focus");
                        }else{
                            if($shelper.children().last().is(".focus")){
                                $shelper.children(".focus").removeClass("focus");
                                $shelper.children().first().addClass("focus");
                            }else{
                                $shelper.children(".focus").removeClass("focus").next().addClass("focus");
                            }
                        }
                        $txtSearch.val(
                            $shelper.children(".focus").attr("title")
                        );
                    }else if(e.keyCode==38){
                        if(!$shelper.is(":has(.focus)")){
                            $shelper.children().last().addClass("focus");
                        }else{
                            if($shelper.children().first().is(".focus")){
                                $shelper.children(".focus").removeClass("focus");
                                $shelper.children().first().addClass("focus");
                            }else{
                                $shelper.children(".focus").removeClass("focus").prev().addClass("focus");
                            }
                        }
                        $txtSearch.val(
                            $shelper.children(".focus").attr("title")
                        );
                    }else{
                        var $tar=$(e.target);
                        $.get(
                            "data/routes/products/searchHelper.php","term="+$tar.val()
                        ).then(data=>{
                                var html="";
                                for(var p of data){
                                    html+=`<li title="${p.title}">
								<div class="search-item" title="${p.title}" data-url="product_details?lid=${p.lid}">${p.title}</div>
							</li>`
                                }
                                $shelper.show().html(html);
                            });
                    }
                }else
                    $("[data-trigger=search]").click();
            }).blur(()=>$shelper.hide());
            $("#clcl").on("mouseover","a",e=>{
                $(e.target).parent().parent().children().addClass("in");
            });
            $("#clcl").on("mouseout","a",e=>{
                $(e.target).parent().parent().children().removeClass("in");
            });
            $("#clcl").click(e=>{
                var $tar=$(e.target);
                $tar.parent().parent().children().removeClass("in");
                $("#dz").html($tar.html());
            })
        });
        */