<?php
    require_once("../../init.php");

    //加载购物车(查询)
    function getCart(){
        global $conn;
        session_start();
        @$uid=$_SESSION["uid"];
        //@$uid=$_REQUEST["uid"];
        if($uid){
            $sql="SELECT cart.cid,cart.uid,cart.pid,cart.count,cart.checked_spec,cart.ischecked,info.mc_pic,info.eTitle,info.cTitle,spec.spec_name,spec.spec_num,price.price FROM mc_cart cart,mc_cake_info info,mc_cake_spec spec,mc_cake_spec_price price WHERE cart.pid=info.pid AND cart.pid=price.pid AND cart.checked_spec=spec.spec_id AND cart.checked_spec=price.spec_id AND cart.uid=$uid";
            $result=mysqli_query($conn,$sql);
            $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
            echo json_encode($rows);
        }else{
            echo json_encode([]);
        }
    }

    //添加商品到购物车(已有->更新,没有->添加)
    function addToCart(){
        global $conn;
        session_start();
        @$uid=$_SESSION["uid"];
        //@$uid=$_REQUEST["uid"];
        @$pid=$_REQUEST["pid"];
        @$count=$_REQUEST["count"];
        @$checked_spec=$_REQUEST["checked_spec"];
        if($uid){
            $sql="SELECT * FROM mc_cart WHERE uid=$uid AND pid=$pid AND checked_spec=$checked_spec";
            $result=mysqli_query($conn,$sql);
            $rows=mysqli_fetch_all($result,MYSQLI_ASSOC);
            if($rows){
                $sql="UPDATE mc_cart SET count=count+$count WHERE uid=$uid AND pid=$pid AND checked_spec=$checked_spec";
            }else{
                $sql="INSERT INTO mc_cart VALUES (null,$uid,$pid,$count,$checked_spec,default)";
            }
            mysqli_query($conn,$sql);
            echo true;
        }
    }

    //更新购物车(数量0->删除,不为0->更新)
    function updateCart(){
        global $conn;
        @$cid=$_REQUEST["cid"];
        @$count=$_REQUEST["count"];
        $sql="";
        if($count==0){
            $sql="DELETE FROM mc_cart WHERE cid=$cid";
        }else{
            $sql="UPDATE mc_cart SET count=$count WHERE cid=$cid";
        }
        mysqli_query($conn,$sql);
        echo true;
    }

    //清空购物车
    function clearCart(){
        global $conn;
        session_start();
        @$uid=$_SESSION["uid"];
        if($uid){
            $sql="DELETE FROM mc_cart WHERE uid=$uid";
            mysqli_query($conn,$sql);
        }
    }

    //全选商品
    function selectAll(){
    	global $conn;
    	@$chkAll=$_REQUEST["chkAll"];
    	session_start();
    	@$uid=$_SESSION["uid"];
    	if($uid){
    	    $sql="UPDATE mc_cart SET ischecked=$chkAll WHERE uid=$uid";
            mysqli_query($conn,$sql);
            echo true;
    	}else{
    	    echo false;
    	}
    }

    //选中一个商品
    function selectOne(){
    	global $conn;
    	@$chkOne=$_REQUEST["chkOne"];
    	@$cid=$_REQUEST["cid"];
    	if($cid){
    	    $sql="UPDATE mc_cart SET ischecked=$chkOne WHERE cid=$cid";
            mysqli_query($conn,$sql);
            echo true;
    	}else{
    	    echo false;
    	}
    }
?>