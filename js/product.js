$(()=>{
    function getInfos(arr){
        var html="";
        for(var i=0;i<arr.length;i++){
            html+=`
                <div>
                <div class="product-one">
                    <a href="product_details.html?pid=${arr[i].pid}" target="_blank">
                        <img src="${arr[i].mc_pic}" alt=""/>
                    </a>
                    <div>
                        <a href="javascript:;">
                            <p>${arr[i].spec_name}/${arr[i].price}&nbsp;RMB</p>
                        </a>
                    </div>
                </div>
                <img src="${arr[i].mc_hot_pic}" alt=""/>
                <div>
                    <a href="product_details.html?pid=${arr[i].pid}" target="_blank">
                        <p>${arr[i].eTitle}</p>
                        <span>${arr[i].cTitle}</span>
                    </a>
                </div>
                </div>
            `;
        }
        return html;
    }
    $.ajax({
        type:"get",
        url:"data/routes/products/getAllProInfo.php",
        success:function(data){
            //console.log(data);
            var spec=data.spec,infos=data.infos;
            var html="";
            html+=`<b>口味筛选</b>
                <ul><li><a href="javascript:;">全部蛋糕</a></li>`;
            for(var i=0;i<spec.length;i++){
                html+=`<li>
                <a href="javascript:;" data-sort_id="${spec[i].mc_sort_id}">${spec[i].mc_sort_name}</a>
                </li>`;
            }
            html+=`</ul>`;
            $("#flavor_lift").html(html);
            $(".product-main").html(getInfos(infos));
        },
        error:function(){
            alert("网络故障请重试!");
        }
    });
    $("#flavor_lift").on("click","a",function(){
        var sort_id=$(this).data("sort_id");
        if(sort_id){
            $.ajax({
                type:"get",
                data:{mc_sort_id:sort_id},
                url:"data/routes/products/getAllProInfo.php",
                success:function(data){
                    $(".product-main").html(getInfos(data.infos));
                },
                error:function(){
                    alert("网络故障请重试!");
                }
            })
        }else{
            $.ajax({
                type:"get",
                url:"data/routes/products/getAllProInfo.php",
                success:function(data){
                    $(".product-main").html(getInfos(data.infos));
                },
                error:function(){
                    alert("网络故障请重试!");
                }
            })
        }
    });
});
//鼠标已入商品图片显示信息
$(".product-main").on("mouseenter",".product-one",e=>{
    $tar=$(e.target);
    //console.log($tar);
    $tar.parent().siblings("div").css("top","180px")
});
$(".product-main").on("mouseleave",".product-one",e=>{
    $tar=$(e.target);
    //console.log($tar);
    $tar.parent().siblings("div").css("top","236px");
    $tar.css("top","236px");
});