<?php
	require_once("../../init.php");

	//获取所有商品信息
	function getAllProInfo(){
		global $conn;
		@$mc_sort_id=$_REQUEST["mc_sort_id"];
		$output=[];
		$sql="SELECT mc_sort_id,mc_sort_name FROM mc_cake_sort";
		$result=mysqli_query($conn,$sql);
		$spec=mysqli_fetch_all($result,1);
		$output["spec"]=$spec;

		$sql="SELECT sort.mc_sort_id,sort.mc_sort_name,mc.pid,mc.mc_hot_id,mc.mc_pic,mc.eTitle,mc.cTitle,hot.mc_hot_name,hot.mc_hot_pic,price.spec_id,price.price,spec.spec_name FROM mc_cake_sort sort,mc_cake_info mc,mc_cake_hot hot,mc_cake_spec_price price,mc_cake_spec spec WHERE sort.mc_sort_id=mc.mc_sort_id AND mc.mc_hot_id=hot.mc_hot_id AND price.pid=mc.pid AND price.default_spec=1 AND price.spec_id=spec.spec_id";
		if($mc_sort_id){
			$sql.=" AND sort.mc_sort_id=$mc_sort_id";
		}
		$result=mysqli_query($conn,$sql);
		$infos=mysqli_fetch_all($result,1);
		$output["infos"]=$infos;

		echo json_encode($output);
	}

	//根据商品id获取商品+评论信息
	function getProductById(){
		global $conn;
		@$pid=$_REQUEST["pid"];//商品id
		@$spec_id=$_REQUEST["spec_id"];//商品规格id
		$output=[
            "pro_info"=>[],//商品详细信息
            "pro_spec"=>[],//该种商品有何种规格
            "title"=>[],//评论标签
            "comment_info"=>[],//评论信息
            "count"=>0,//总个数
            "pageSize"=>5,//每页5个
            "pageCount"=>0,//总页数
            "pageNo"=>0//当前页数
		];
        @$pno=(int)$_REQUEST["pno"];//当前页数
        if($pno){
        	$output["pageNo"]=$pno;
        }
        @$comment_title=$_REQUEST["comment_title"];//标签内容

		//商品详细信息
		$sql="SELECT info.smallPic,info.middlePic,info.BigPic,info.eNote,info.cNote,info.eTitle,info.cTitle,info.material,info.texture,info.flavor,info.flavor_base,info.detailETitle,info.detailCTitle,info.detailImg,info.sImg,spec.spec_id,spec.spec_name,spec.spec_num,spec.spec_size,price.price,price.default_spec FROM mc_cake_info info,mc_cake_spec spec,mc_cake_spec_price price WHERE price.pid=info.pid AND spec.spec_id=price.spec_id AND info.pid=$pid";
		if($spec_id){
			$sql.=" AND price.spec_id=$spec_id";
		}else{
			$sql.=" AND price.default_spec=1";
		}
		$result=mysqli_query($conn,$sql);
		$pro_info=mysqli_fetch_assoc($result);
		$output["pro_info"]=$pro_info;//商品详细信息

		//该种商品有何种规格
		$sql="SELECT spec.spec_id,spec.spec_name,spec.spec_num,spec.spec_size,price.price FROM mc_cake_spec spec,mc_cake_spec_price price WHERE spec.spec_id=price.spec_id AND price.pid=$pid";
		$result=mysqli_query($conn,$sql);
		$pro_spec=mysqli_fetch_all($result,1);
        $output["pro_spec"]=$pro_spec;//该种商品有何种规格

        //评论标签
        $sql="SELECT comment_title FROM mc_comment WHERE pid=$pid";
        $result=mysqli_query($conn,$sql);
        $title=mysqli_fetch_all($result,1);
        $output["title"]=$title;

		//评论信息
        $sql="SELECT comment.cid,comment.uid,comment.pid,comment.comment_title,comment.comment_content,comment.comment_time,user.uname FROM mc_comment comment,mc_user user WHERE comment.uid=user.uid AND comment.pid=$pid";
		if($comment_title){
			$sql.=" AND comment.comment_title='$comment_title'";
		}
		$result=mysqli_query($conn,$sql);
		$comment_info=mysqli_fetch_all($result,1);
		//$output["comment_info"]=$comment_info;//评论信息
		//分页
		$output["count"]=count($comment_info);
		$output["pageCount"]=ceil($output["count"]/$output["pageSize"]);
		$sql .= " limit ".($output["pageNo"])*$output["pageSize"].",".$output["pageSize"];
		$result=mysqli_query($conn,$sql);
		$output["comment_info"]=mysqli_fetch_all($result,1);

		echo json_encode($output);
	}
	//getProductById();


	/*根据关键词获取 东
	function getProductsByKw(){
        global $conn;
        $output=[
            "count"=>0,//总个数
            "pageSize"=>9,//每页9个
            "pageCount"=>0,//总页数
            "pageNo"=>0,//现在第几页
            "data"=>[]////商品列表
        ];
        @$pno=(int)$_REQUEST["pno"];
        if($pno);$output["pageNo"]=$pno;
        //?kw=mac 256g
        @$kw=$_REQUEST["kw"];
        //$sql="SELECT lid,md,price,title FROM xz_laptop inner join xz_laptop_pic on lid=laptop_id limit 1";
        $sql="SELECT lid,price,title,(SELECT md FROM xz_laptop_pic WHERE laptop_id=lid limit 1) as md FROM xz_laptop";
        if($kw){
            //$kw=mac 256g
            //将$kw按空格切割为数组
            $kws=explode(" ",$kw);//js:split
            //$kws:[mac,256g]
            for($i=0;$i<count($kws);$i++){
                $kws[$i]=" title like '%".$kws[$i]."%'";
            }
            //$kws:[
                //"title like '%mac%'",
                 //"title like '%256g%'"
            //]
            $sql.=" where ".implode(" and ",$kws);
                            //js: $kws.join(" and ")
        }
        $result=mysqli_query($conn,$sql);
        //echo json_encode(mysqli_fetch_all($result,1));
        $products=mysqli_fetch_all($result,1);
        //分页
        $output["count"]=count($products);
        $output["pageCount"] = ceil($output["count"]/$output["pageSize"]);
        $sql .= " limit ".($output["pageNo"])*$output["pageSize"].",".$output["pageSize"];
        $result=mysqli_query($conn,$sql);
        $output["data"]=mysqli_fetch_all($result,1);
        echo json_encode($output);
    }*/

	/*搜索帮助 东
	function searchHelper(){
        global $conn;
        @$kw=$_REQUEST["term"];
        $sql="select lid,title,sold_count from xz_laptop ";
        if($kw){
            $kws=explode(" ",$kw);
            for($i=0;$i<count($kws);$i++){
                $kws[$i]=" title like '%".$kws[$i]."%'";
            }
            $sql.="  where ".implode(" and ",$kws);
        }
        $sql.=" order by sold_count desc limit 10";
        $result=mysqli_query($conn,$sql);
        echo json_encode(mysqli_fetch_all($result,1));
    }*/
?>
