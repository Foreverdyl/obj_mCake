$(()=>{
	/**********购物车页面****************/
	//加载购物车 getCart
	function getCart(){
		$.ajax({
			type:"get",
			url:"data/routes/cart/getCart.php",
			success:function(data){
				//console.log(data);
				var html="",chkAll_num=true,num=0;
				for(var i=0;i<data.length;i++){
					var c=data[i];
					num+=parseInt(c.count);
					if(c.ischecked==0){
						html+=`<tr><td><i></i><sup data-cid="${c.cid}"></sup></td>`;
						chkAll_num=false;
					}else if(c.ischecked==1){
						html+=`<tr><td><i></i><sup data-cid="${c.cid}" class="active"></sup></td>`;
					}
					html+=`
						<td>
							<a href="product_details.html?pid=${c.pid}">
								<img src="${c.mc_pic}"/>
							</a>
							<div>
								<a href="product_details.html?pid=${c.pid}">${c.eTitle}</a>
								<p>${c.cTitle}</p><br/>
								<p>赠品：标配餐具10份 生日蜡烛1支</p>
							</div>
						</td>
						<td>${c.spec_name}<p>适合${c.spec_num}食用</p></td>
						<td>￥${c.price}</td>
						<td>
							<span class="reduce">-</span>
							<input type="text" data-cid="${c.cid}" value="${c.count}"/>
							<span class="add">+</span>
						</td>
						<td>￥${(c.price*c.count).toFixed(2)}</td>
						<td>
							<p class="">删除</p><!--del_pro-->
							<p>
								<a href="javascript:;">确定</a>
								<a href="javascript:;">取消</a>
							</p>
						</td>
					</tr>
					`;
				}
				if(chkAll_num){
					html+=`<tr><td colspan="7"><i></i><sup class="active"></sup><span>全选</span></td></tr>`;
				}else{
					html+=`<tr><td colspan="7"><i></i><sup class=""></sup><span>全选</span></td></tr>`;
				}
				$(".main_list>tbody").html(html);
				//合计/商品总件数,总价格
				var $count=$(".total i");
				var $total=$(".total b");
				var $rows=$(".main_list>tbody>tr:not(:last-child):has(sup.active)");
				var $counts=$rows.find("input");
				var $totals=$rows.find("td:nth-child(6)");
				var count=0,total=0;
				for(var n of $counts){
					count+=parseInt($(n).val());
				}
				for(var t of $totals){
					total+=parseFloat($(t).html().slice(1));
				}
				$count.html(count);
				$total.html("¥"+total);
				//头部数量
				$("#welcomeList .cart_count").html(num);
			},
			error:function(){
				alert("网络故障请重试!");
			}
		})
	}
	//更新/全选 selectAll
	function selectAll(chkAll_num){
		$.ajax({
			type:"post",
			url:"data/routes/cart/selectAll.php",
			data:{chkAll:chkAll_num},
			success:function(data){
				if(data==1){
					getCart();
				}
			},
			error:function(){
				alert("网络故障请重试/all!");
			}
		})
	}
	//更新/单选 selectOne
	function selectOne(chkOne,cid){
		$.ajax({
			type:"post",
			url:"data/routes/cart/selectOne.php",
			data:{chkOne:chkOne,cid:cid},
			success:function(data){
				if(data==1){
					getCart();
				}
			},
			error:function(){
				alert("网络故障请重试/one!");
			}
		})
	}
	//更新/数量 updateCart
	function updateCart(cid,count){
		$.ajax({
			type:"post",
			url:"data/routes/cart/updateCart.php",
			data:{cid:cid,count:count},
			success:function(data){
				if(data==1){
					getCart();
				}
			},
			error:function(){
				alert("网络故障请重试/update!");
			}
		})
	}

	getCart();

	//点击全选/取消全选
	$(".main_list>tbody").on("click","tr:last-child>td",function(){
		var sup=$(this).children("sup")[0];
		if(sup.className=="active"){
			sup.className="";
			selectAll(0);
		}else{
			sup.className="active";
			selectAll(1);
		}
	});
	//点击选中商品/取消选中
	$(".main_list>tbody").on("click","tr:not(:last-child)>td:first-child",function(){
		var sup=$(this).children("sup")[0];
		if(sup.className=="active"){
			sup.className="";
			selectOne(0,$(sup).data("cid"));
		}else{
			sup.className="active";
			selectOne(1,$(sup).data("cid"));
		}
	});
	//点击增减商品
	$(".main_list>tbody").on("click","td:nth-child(5)>span",function(){
		var input=$(this).siblings("input");
		var n=parseInt(input.val());
		if($(this).is(".add")){
			updateCart(input.data("cid"),n+=1);
		}else if($(this).is(".reduce")&&n!=1){
			updateCart(input.data("cid"),n-=1);
		}else if($(this).is(".reduce")&&n==1){
			if(confirm("是否继续删除?")){
				updateCart(input.data("cid"),0);
			}
		}
	});
	//点击选择删除
	$(".main_list>tbody").on("click","td:last-child>p:first-child",function(){
		$(this).addClass("del_pro");
		$(this).next().css("display","block");
	});
	//点击选择是否删除
	$(".main_list>tbody").on("click","td:last-child>p:last-child a",function(){
		if($(this).html()=="确定"){
			updateCart($(this).parent().parent().siblings().children("input").data("cid"),0);
		}else if($(this).html()=="取消"){
			$(this).parent().css("display","none");
			$(this).parent().prev().removeClass("del_pro");
		}
	});

	/**********购物车页面结束****************/

	$(".main .myCart p>a:last-child").on("click",function(){
		$(this).parent().parent().parent().addClass("hidelist").next().removeClass("hidelist");
		var $ul=$(this).parent().parent().parent().prev();
		$ul.children("li").removeClass("active");
		$ul.children("li:nth-child(3)").addClass("active");
		$ul.children("li:nth-child(4)").addClass("active");
		$(".selected-date-bg").removeClass("hidelist")

	});

	/**********订单页面****************/
	//二、选择配送时间
	function toggleSH(s,e,c1,c2){
		$(s).click(()=>{
			$(e).removeClass(c1).addClass(c2);
		})
	}
	toggleSH(".order-msg>li:nth-child(2)>div",".selected-date-bg","hade","show");//显示
	toggleSH(".close-icon",".selected-date-bg","show","hade");//关闭X
	toggleSH(".date-btn",".selected-date-bg","show","hade");//确定
	//选择日期
	$(".date-list>ul").on("click","p",function(){
		$(this).parent().addClass("date-selected").siblings().removeClass("date-selected");
	});
	//选择时间
	$(".date-time>div").on("click","div",function(){
		console.log($(this));
		$(this).siblings("ul").toggleClass("show-date-time-ul")
			.parent().siblings().children("ul").removeClass("show-date-time-ul");
		$(".date-time>div>ul").on("click","li",function(){
			console.log($(this).html());
			$(this).addClass("date-selected").siblings().removeClass("date-selected")
				.parent().siblings("p.date-time-num").html($(this).html())
				.siblings().removeClass("show-date-time-ul");
		})
	})
});