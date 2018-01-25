//轮播
$(()=> {
    var $ulImgs = $("#banner>.banner-img"),
        $ulInds = $("#banner>.indicators");
    var LIWIDTH = 1280, INTERVAL = 1000, WAIT = 3000;
    var moved = 0, timer = null, canMove = true;
    $.get("data/routes/index/getCarousel.php")
        .then(data=> {
            //console.log(data);
            var html = "";
            for (var c of data) {
                html += `
                    <li>
                        <a href="javascript:;">
                            <img src="${c.bpic}">
                        </a>
                    </li>
                `;
            }
            html += `
                <li>
                    <a href="javascript:;">
                        <img src="${data[0].bpic}">
                    </a>
                </li> `;
            $ulImgs.html(html)
                .css("width", (data.length + 1) * LIWIDTH);
            $ulInds.html("<li></li>".repeat(data.length))
                .children().first().addClass("hover");
            function autoMove() {
                if (canMove) {
                    if (moved == data.length) {//先判断是否最后一张
                        moved = 0;//将moved归0
                        $ulImgs.css("left", 0);//将ul的left瞬间归0
                    }
                    timer = setTimeout(()=> {//先等待WATI秒
                        move(1, autoMove);
                    }, WAIT);
                }
            }

            autoMove();
            $("#banner").hover(
                ()=> {//关闭轮播的开关变量
                    canMove = false;
                    clearTimeout(timer);//停止等待
                    timer = null;
                },
                ()=> {//打开轮播开关，启动自动轮播
                    canMove = true;
                    autoMove();
                }
            );
            $ulInds.on("click", "li", e=> {
                moved = $(e.target).index();
                $ulImgs.stop(true).animate({
                    left: -LIWIDTH * moved
                }, INTERVAL);
                $ulInds.children(":eq(" + moved + ")")
                    .addClass("hover")
                    .siblings().removeClass("hover");
            });
            function move(dir, callback) {
                moved += dir;//按照方向增减moved
                //如果moved没有到头
                if (moved < data.length) {
                    //让ulInds中moved位置的li设置hover
                    $ulInds.children(":eq(" + moved + ")")
                        .addClass("hover")
                        .siblings().removeClass("hover");
                } else {//否则，如果到头了
                    //让ulInds中第一个li设置为hover
                    $ulInds.children(":eq(0)")
                        .addClass("hover")
                        .siblings().removeClass("hover");
                }
                //先清除ulImgs上动画，让ulImgs移动到新的left位置
                $ulImgs.stop(true).animate({
                    //新的left位置永远等于-LIWIDTH*moved
                    left: -LIWIDTH * moved
                }, INTERVAL, callback);
            }

            $("#banner>[data-move=right]").click(()=> {
                if (moved == data.length) {
                    moved = 0;
                    $ulImgs.css("left", 0);
                }
                move(1);
            });
            $("#banner>[data-move=left]").click(()=> {
                //如果是第一张
                if (moved == 0) {//就跳到最后一张
                    moved = data.length;
                    $ulImgs.css("left", -LIWIDTH * moved);
                }
                move(-1);
            })
        })
});
//加载首页商品
$(()=>{
    function getProInfo(arr){
        var html="";
        for(var i=0;i<arr.length;i++){
            var p=arr[i];
            html+=`
            <div>
                <div class="product-one">
                    <a href="product_details.html?pid=${p.pid}" target="_blank"><img src="${p.mc_pic}"/></a>
                    <div>
                        <a href="#">${p.spec_name}/${p.price}&nbsp;RMB</a>
                        <img src="Images/index/cart1.png" alt=""/>
                    </div>
                </div>
                <img src="${p.mc_hot_pic}" alt=""/>
                <a href="javascript:;">
                    <p>${p.eTitle}</p>
                    <span>${p.cTitle}</span>
                </a>
            </div>
        `;
        }
        return html;
    }
    $.get("data/routes/index/get_index_products.php")
        .then(products=> {
            //console.log(products);
            $("#f1").html(getProInfo(products.new_arrival));
            $("#f2").html(getProInfo(products.top_sale));
            $("#f3").html(getProInfo(products.recommended));

            /*********确定电梯按钮列表是否显示*********/
            var $divLift=$("#lift"),
                $floors=$(".floor");
            //console.log($floors);
            $(window).scroll(()=>{
                var scrollTop=$(window).scrollTop();
                //任意元素距body顶部的总距离
                var offsetTop=$("#f1").offset().top;
                if(offsetTop<scrollTop+innerHeight/2){
                    $divLift.show();
                }else{
                    $divLift.hide();
                }
                /******具体显示哪个电梯按钮*************/
                for(var f of $floors){
                    var $f=$(f);
                    //console.log(f);
                    var offsetTop=$f.offset().top;
                    if(offsetTop<scrollTop+innerHeight/2){
                        //找到该楼层对应的li按钮
                        var i=$floors.index($f);
                        var $li=
                            $divLift.find(".lift_item:eq("+i+")");
                        //为li添加lift_item_on class
                        $li.addClass("lift_item_on")
                            //为其兄弟去掉lift_item_on class
                            .siblings().removeClass("lift_item_on");
                    }
                }
            });
            $divLift.on("click",".lift_item",function(){
                var $li=$(this);//this->li
                if(!$li.is(":last-child")){
                    var i=$li.index();//找当前li对应的楼层
                    var offsetTop=$floors.eq(i).offset().top;
                    //$(window).scrollTop(offsetTop-70)
                    //在HTML元素上调用animate
                    //document.body.scrollTop||
                    //document.documentElement.scrollTop
                    $("html,body").stop(true).animate({
                        scrollTop:
                            $("#header-all").is(".fixed_nav")?
                            offsetTop-230:offsetTop-230-80
                    },500);
                }else{
                    $("html,body").stop(true).animate({
                        scrollTop:0
                    },500);
                }
            })

    })
});
//背景//////////////////////////////////////////////////////
//(()=>{
//    //获取mycanvas画布
//    var can = document.getElementById("snow");
//    var ctx = can.getContext("2d");
//    //画布宽度
//    var wid = window.innerWidth;
//    //画布高度
//    var hei = window.innerHeight;
//    can.width = wid;
//    can.height = hei;
//    //雪花数目
//    var snow = 200;
//    //雪花坐标、半径
//    var arr = []; //保存各圆坐标及半径
//    for (var i = 0; i < snow; i++) {
//        arr.push({
//            x: Math.random() * wid,
//            y: Math.random() * hei,
//            r: Math.random() * 3 + 1
//        })
//    }
//    //画雪花
//    function DrawSnow() {
//        ctx.clearRect(0, 0, wid, hei);
//        ctx.fillStyle = "white";
//        ctx.beginPath();
//        for (var i = 0; i < snow; i++) {
//            var p = arr[i];
//            ctx.moveTo(p.x, p.y);
//            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI, false);
//        }
//        ctx.fill();
//        SnowFall();
//        ctx.closePath();
//    }
//    //雪花飘落
//    function SnowFall() {
//        for (var i = 0; i < snow; i++) {
//            var p = arr[i];
//            //纵向
//            p.y += Math.random() * 0.5 + 1;
//            if (p.y > hei) {
//                p.y = 0;
//            }
//            //横向
//            p.x += Math.random() * 2 + 1;
//            if (p.x > wid) {
//                p.x = 0;
//            }
//        }
//    }
//    setInterval(DrawSnow, 10);
//})();
//圣诞老人
$("#oldMan").on("mouseover",function(e){
    $(e.target).siblings().addClass("in");
});
$("#oldMan").on("mouseout",function(e){
    $(e.target).siblings().removeClass("in");
});
//鼠标已入商品图片显示信息
$(".floor").on("mouseenter",".product-one",e=>{
    $tar=$(e.target);
    $tar.parent().siblings("div").css("top","180px")
});
$(".floor").on("mouseleave",".product-one",e=>{
    $tar=$(e.target);
    //console.log($tar);
    $tar.parent().siblings("div").css("top","236px");
    $tar.css("top","236px");
});
