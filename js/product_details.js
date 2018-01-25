$(()=>{
    function getProInfodetails(smallPic,middlePic,BigPic,info='',spec=''){
        var html="",Info={};
        smallPic=smallPic.slice(1,-1).split(",");
        middlePic=middlePic.slice(1,-1).split(",");
        BigPic=BigPic.slice(1,-1).split(",");
        for(var i=0;i<smallPic.length;i++){
            html+=`
            <li class="i1">
                <img src="${smallPic[i]}" data-md="${middlePic[i]}" data-lg="${BigPic[i]}">
            </li>
            `;
        }
        Info.smallPic=html;
        var html="";
        html+=`
            <img id="mImg" src="${middlePic[0]}">
            <div id="note"><span>${info.eNote}<br/><br/>${info.cNote}</span></div>
            <div id="mask"></div>
            <div id="superMask"></div>
        `;
        Info.middleDiv=html;
        Info.BigPic=BigPic;
        var html="";
        html+=`
            <div id="detail-title"><span>${info.eTitle}</span><span>${info.cTitle}</span></div>
            <div id="details-price"><span>¥${info.price}</span></div>
            <ul id="weight">
        `;
        for(var i=0;i<spec.length;i++){
            html+=`<li class="lf show">`;
            if(spec[i].spec_id==info.spec_id){
                html+=`<div class="show" ></div>`;
            }else{
                html+=`<div></div>`;
            }
            html+=`<span data-spec="${spec[i].spec_id}">${spec[i].spec_name}</span></li>`;
        }
        html+=`</ul>
            <div id="prompt">
                <span>适合${info.spec_num}人食用</span>
                <span>SIZE:${info.spec_size}</span>
                <p>需提前5小时预订</p>
                <div>
                    <ul class="lf">
                        <li><label>Base口味基底</label></li>
                        <li><label>Texture口感</label></li>
                        <li><label>Flavor口味</label></li>
                    </ul>
                    <ul>
                        <li><span>${info.flavor_base}</span></li>
                        <li><span>${info.texture}</span><br/></li>
                        <li><span>${info.flavor}</span><br/></li>
                    </ul>
                </div>
            </div>
            <!-- 数量 -->
            <div id="cake_num">
                <span class="lf">数量</span>
                <dl>
                    <dd class="lf reduce">-</dd>
                    <dt>
                        <input type="text" value="1" class="lf">
                    </dt>
                    <dd class="lf add">+</dd>
                </dl>
                <table class="clear"></table>
            </div>
            <!-- 购买部分 -->
            <div class="shops">
                <ul>
                    <li class="lf go_buy">立即购买</li>
                    <li class="lf add_cart">加入购物车</li>
                </ul>
            </div>
            <!--原材料+评价-->
            <div id="Select_view">
                <ul class="clear Select_view">
                    <li>
                        <span>Best Ingredient</span>
                        <p data-view="1" class="selected">优质原材料</p>
                    </li>
                    <li>
                        <span>Evaluation</span>
                        <p data-view="2">累计点评<i>(90)</i></p>
                    </li>
                </ul>
                <p class="not_selected selected">${info.material}</p>
                <ul class="not_selected comment_list"></ul>
            </div>
        `;
        Info.rightDiv=html;
        var html="";
        html+=`
        <div>
            <img src="${info.detailImg}" alt=""/>
            <p>${info.detailETitle}</p><br/>
            <p>${info.detailCTitle}</p>
            <p class="line"></p>
            <img src="${info.sImg}" alt=""/>
        </div>
        `;
        Info.detailDiv=html;
        return Info;
    }
    function sortObj(obj){
        var arr=[],keys=[],newObj={};
        for(var key in obj){
            arr.push(obj[key]);
            keys.push(key);
        }
        for(let i=0;i<arr.length;i++){
            for(let j=0;j<arr.length-i-1;j++){
                if(arr[j]<arr[j+1]){
                    [arr[j],arr[j+1]]=[arr[j+1],arr[j]];
                    [keys[j],keys[j+1]]=[keys[j+1],keys[j]];
                }
            }
        }
        for(let k=0;k<arr.length;k++){
            newObj[keys[k]]=arr[k];
        }
        return newObj;
    }
    //UPDATE mc_comment SET comment_time='2017-11-11 11:11';
    function getComment(pno=1,title=""){
        return new Promise(callback=>{
            $.ajax({
                type:"get",
                url:"data/routes/products/getProductById.php",
                data:{
                    pid:location.search.split("=")[1],
                    pno:pno,
                    comment_title:title
                },
                success:function(data){
                    console.log(data);
                    var hash={};
                    for(var val of data.title){
                        if(!hash[val.comment_title]){
                            hash[val.comment_title]=1;
                        }else{
                            hash[val.comment_title]++;
                        }
                    }
                    var html="",newObj=sortObj(hash);
                    html+=`<li><ul class="clear comment_title">`;
                    for(var key in newObj){
                        //被选中样式 .selected
                        html+=`<li>${key} <span>(${newObj[key]}) </span></li>`;
                    }
                    html+=`</ul></li>`;
                    html+=`<li><ul>`;
                    for(let i=0;i<data.comment_info.length;i++){
                        var c=data.comment_info[i];
                        html+=`
                    <li>
                        <p>${c.comment_content}</p>
                        <div>
                            <p><span></span><span> 会员 ${c.uname}</span></p>
                            <span>${c.comment_time}</span>
                        </div>
                    </li>
                    `;
                    }
                    html+=`</ul></li>`;
                    html+=`<li class="pages clear"><div class="rt"><ul><li class="prev"></li>`;
                    for(let i=1;i<data.pageCount;i++){
                        if(i==1){
                            html+=`<li class="selected">${i}</li>`;
                        }else{
                            html+=`<li>${i}</li>`;
                        }
                    }
                    html+=`<li class="next"></li></ul></div></li>`;
                    $(".comment_list").html(html);
                    callback();
                },
                error:function(){
                    alert("网络故障请重试");
                }
            })
        })
    }
    function addCart(pid,count,checked_spec){
        return new Promise ((resolve,reject)=>{
            $.ajax({
                type:"get",
                url:"data/routes/cart/addToCart.php",
                data:{pid:pid,count:count,checked_spec:checked_spec},
                success:function(data){
                    if(data){
                        resolve();
                    }
                },
                error:function(){
                    alert("网络故障请重试");
                    reject();
                }
            })
        })
    }

    //加载当前页面信息
    $.ajax({
        type:"get",
        url:"data/routes/products/getProductById.php",
        data:{pid:location.search.split("=")[1]},
        success:function(data){
            //console.log(data);
            var info=data.pro_info,spec=data.pro_spec;
            $("#icon_list").html(getProInfodetails(info.smallPic,info.middlePic,info.BigPic).smallPic);
            $("#mediumDiv").html(getProInfodetails('',info.middlePic,'',info).middleDiv);
            $("#largeDiv").css("backgroundImage","url("+getProInfodetails('','',info.BigPic).BigPic[0]+")");
            $("#show-details").html(getProInfodetails('','','',info,spec).rightDiv);
            $("#detail").html(getProInfodetails('','','',info,spec).detailDiv);
        },
        error:function(){
            alert("网络故障请重试!");
        }
    });
    //点击切换规格
    $("#show-details").on("click","#weight li",function(){
        var spec=$(this).children("span").data("spec");
        $.ajax({
            type:"get",
            url:"data/routes/products/getProductById.php",
            data:{pid:location.search.split("=")[1],spec_id:spec},
            success:function(data){
                $("#show-details").html(getProInfodetails('','','',data.pro_info,data.pro_spec).rightDiv);
            },
            error:function(){alert("网络故障请重试!");}
        })
    });
    //点击增减商品
    $("#show-details").on("click","#cake_num dd",function(){
        var n=parseInt($("#cake_num input").val());
        if($(this).is(".add")){
            n++;
        }else if($(this).is(".reduce")){
            if(n!=1){
                n--;
            }
        }
        $("#cake_num input").val(n);
    });
    //点击加入购物车
    $("#show-details").on("click",".add_cart",function(){
        $.ajax({
            type:"get",
            url:"data/routes/users/isLogin.php",
            success:function(data){
                if(data.ok==1){
                    //console.log(data.uid);
                    var pid=location.search.split("=")[1];
                    var count=parseInt($("#cake_num input").val());
                    var checked_spec=$("#weight li div.show").next().data("spec");
                    addCart(pid,count,checked_spec).then(()=>{
                        alert("加入商品成功!");
                    });
                }else{
                    alert("尚未登录,请前往登录");
                }
            }
        })
    });
    //点击立即购买
    $("#show-details").on("click",".go_buy",function(){
        $.ajax({
            type:"get",
            url:"data/routes/users/isLogin.php",
            success:function(data){
                if(data.ok==1){
                    //console.log(data.uid);
                    var pid=location.search.split("=")[1];
                    var count=parseInt($("#cake_num input").val());
                    var checked_spec=$("#weight li div.show").next().data("spec");
                    addCart(pid,count,checked_spec).then(()=>{
                        location="shopping_cart.html";
                    });
                }else{
                    alert("尚未登录,请前往登录");
                }
            }
        })
    });
    //点击切换原材料/评价
    $("#show-details").on("click","#Select_view .Select_view li",function(){
        var p=$(this).children()[1];
        if(!$(p).is(".selected")){
            $(p).addClass("selected").parent().siblings().children("p").removeClass("selected");
            //原材料
            if($(p).data("view")==1){
                $(p).parent().parent().siblings("p").addClass("selected").siblings("ul").removeClass("selected");
	        //累计点评
            }else if($(p).data("view")==2){
                $(p).parent().parent().siblings("ul").addClass("selected").siblings("p").removeClass("selected");
                //加载评价//默认页码1
                getComment();
            }
        }
    });
    //点击切换页码(非上下页)
    $("#show-details").on("click",".comment_list .pages li",function(){
        if(!($(this).is(".prev")&&$(this).is(".next"))){
            console.log($(this));
            getComment($(this).html(),"").then(()=>{
                console.log($(this));
                $(this).addClass("selected");
                $(this).siblings().removeClass("selected");
            });
        }
    });



    $("#icon_list").on("click","li",function(e){
        //console.log($(e.target).data("lg"))
        //console.log($(e.target).data("md"))
        //console.log($("#largeDiv"))
        $("#mImg").attr("src",$(e.target).data("md"));
        $("#largeDiv").css("backgroundImage","url("+$(e.target).data('lg')+")")
    });
    //放大镜
    $("#mediumDiv").on("mouseover","#superMask",e=>{
        //console.log($(e.target))
        var $tar=$(e.target);
        $tar.siblings("#mask").css("display","block");
        $tar.parent().siblings("#largeDiv").css("display","block");
    });
    $("#mediumDiv").on("mouseout","#superMask",e=>{
        //console.log($(e.target))
        var $tar=$(e.target);
        $tar.siblings("#mask").css("display","none");
        $tar.parent().siblings("#largeDiv").css("display","none");
    });
    var MSIZE=175;
    $("#mediumDiv").on("mousemove","#superMask",e=>{
        //console.log($(e.target))
        var $tar=$(e.target);
        var x=e.offsetX,y=e.offsetY;
        var top=y-MSIZE/2,left=x-MSIZE/2;
        if(top<0) top=0;
        else if(top>175) top=175;
        if(left<0) left=0;
        else if(left>175) left=175;
        $tar.siblings("#mask").css({
            display:"block",
            top:top+"px",
            left:left+"px"
        });
        $tar.parent().siblings("#largeDiv").css({
            backgroundPosition:-16/7*left+"px "+(-16/7*top)+"px"
        })
    })
});