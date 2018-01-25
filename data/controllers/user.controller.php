<?php
    require_once("../../init.php");//$conn
	function register(){
        global $conn;//引入全局变量
        session_start();
        @$uname=$_REQUEST["uname"];
        @$upwd=$_REQUEST["upwd"];
        @$yzm=$_REQUEST["yzm"];
        //验证
        $unamePattern='/^[a-zA-Z0-9_]{3,12}$/';
        $upwdPattern='/^[a-zA-Z0-9_]{3,12}$/';
        $yzmPattern='/^[a-zA-Z]{4}$/';
        if(!preg_match($unamePattern,$uname)){
            echo '{"code":-2,"msg":"用户名格式不正确"}';
            exit;
        };
        if(!preg_match($upwdPattern,$upwd)){
            echo '{"code":-3,"msg":"密码格式不正确"}';
            exit;
        };
        if(!preg_match($yzmPattern,$yzm)){
            echo '{"code":-4,"msg":"验证码格式不正确"}';
            exit;
        };
        //验证:用户输入的验证码是否正确
        $code=$_SESSION["code"];
        if($code!=$yzm){
            echo '{"code":-5,"msg":"验证码不正确"}';
            exit;
        };
        $sql="INSERT INTO mc_user (uid,uname,upwd) VALUES (null,'$uname',md5('$upwd'))";
        $result=mysqli_query($conn,$sql);
        if($result){
            echo '{"code":1,"msg":"注册成功,可以去首页登录了~"}';
        }else{
            echo '{"code":-1,"msg":"注册失败"}';
        }
    }

	function checkName(){
        global $conn;
        @$uname=$_REQUEST["uname"];
        if($uname){
            $sql="SELECT * FROM mc_user WHERE uname='$uname'";
            $result=mysqli_query($conn,$sql);
            $users=mysqli_fetch_all($result,MYSQLI_ASSOC);
            //如果查询结果中有数据,不能使用
            if(count($users)!=0){
                return false;
            }else{
                return true;
            }
        }
    }

	function login(){
        global $conn;
        session_start();
        @$uname=$_REQUEST["uname"];
        @$upwd=$_REQUEST["upwd"];
        @$yzm=$_REQUEST["yzm"];//获取用户输入验证码
        //验证格式是否正确
        $unamePattern='/^[a-zA-Z0-9_]{3,12}$/';
        $upwdPattern='/^[a-zA-Z0-9_]{3,12}$/';
        $yzmPattern='/^[a-zA-Z]{4}$/';//验证码格式的正则表达式
        if(!preg_match($unamePattern,$uname)){
            echo '{"code":-2,"msg":"用户名格式不正确"}';
            exit;
        };
        if(!preg_match($upwdPattern,$upwd)){
            echo '{"code":-3,"msg":"密码格式不正确"}';
            exit;
        };
        if(!preg_match($yzmPattern,$yzm)){
            echo '{"code":-4,"msg":"验证码格式不正确"}';
            exit;
        };
        //验证:用户输入的验证码是否正确
        $code=$_SESSION["code"];
        if($code!=$yzm){
            echo '{"code":-5,"msg":"验证码不正确"}';
            exit;
        };
        $sql="SELECT * FROM mc_user WHERE uname='$uname' AND BINARY upwd=md5('$upwd')";
        $result=mysqli_query($conn,$sql);
        /*判断sql是否出错
        if(mysqli_error($conn)){
            echo mysqli_error($conn);
        }*/
        $row=mysqli_fetch_assoc($result);
        if($row==null){
            echo '{"code":-1,"msg":"用户名或密码错误"}';
        }else{
            $_SESSION["uid"]=$row["uid"];
            echo '{"code":0,"msg":"登录成功"}';
        }
    };

	function logout(){
        session_start();
        $_SESSION["uid"]=null;
    }

	function isLogin(){
        global $conn;
        session_start();
        @$uid=$_SESSION["uid"];
        if($uid){
            $sql="SELECT uname,avatar FROM mc_user WHERE uid=$uid";
            $result=mysqli_query($conn,$sql);
            $user=mysqli_fetch_all($result,1);
            return ["ok"=>1,"uname"=>$user[0]["uname"],"avatar"=>$user[0]["avatar"],"uid"=>$_SESSION["uid"]];
        }else{
            return ["ok"=>0];
        }
    }
?>