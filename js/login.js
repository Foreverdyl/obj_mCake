$(()=>{
    function isShow(elem,text){
        if(elem.val()==""){
            elem.siblings("span").html(text+"不能为空").css("color","#f00");
        }else{
            elem.siblings("span").html("");
        }
    }
    $("#uname").blur(function(){isShow($(this),"用户名");});
    $("#upwd").blur(function(){isShow($(this),"密码");});
    $("#yzm").blur(function(){isShow($(this),"验证码");});
    $("#btnLogin").click(()=>{
        var uname=$("#main #uname").val().trim();
        var upwd=$("#upwd").val().trim();
        var yzm=$("#yzm").val().trim();
        var unameReg=/^[a-zA-Z0-9_]{3,12}$/i;
        var upwdReg=/^[a-zA-Z0-9_]{3,12}$/i;
        var yzmReg=/^[a-zA-Z]{4}$/i;
        //console.log(uname,upwd,yzm);
        if(!unameReg.test(uname)){
            $("#main #uname").next().html("用户名格式不正确").css("color","#f00");
            return;
        }
        if(!upwdReg.test(upwd)){
            $("#upwd").next().html("密码格式不正确").css("color","#f00");
            return;
        }
        if(!yzmReg.test(yzm)){
            $("#yzm").siblings("span").html("验证码格式不正确").css("color","#f00");
            return;
        }
	    $.ajax({
		    type:"post",
		    url:"data/routes/users/login.php",
		    data:{uname:uname,upwd:upwd,yzm:yzm},
		    dataType:"json",
		    success:function(data){
			    //console.log(data);
			    alert(data.msg);
			    if(data.code==0){
				    //如果有search
				    if(location.search!==""){
					    location=decodeURIComponent(location.search.slice(6));
				    }else{
					    location="index.html";
				    }
                }
		    },
		    error:function(){
			    alert("网络故障请检查!");
		    }
	    });
    });
    //点击验证码更换图片
    $("#setYzm").click(function(){
        this.src="data/03_code_gg.php";
    });
	//点击切换登录方式
	$(".login_list").on("click","p>span",function(){
		if(!$(this).hasClass("active")){
			$(this).addClass("active").siblings("span").removeClass("active");
			if($(this).html()=="普通登录"){
				$(this).parent().siblings("div").addClass("hide").siblings("ul").removeClass("hide");
			}else if($(this).html()=="二维码登录"){
				$(this).parent().siblings("div").removeClass("hide").siblings("ul").addClass("hide");
			}
		}
	});
});