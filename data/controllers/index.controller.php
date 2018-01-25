<?php
    require_once("../../init.php");
    function getCarousel(){
        global $conn;
        $sql="SELECT * FROM mc_index_carousel";
        $result=mysqli_query($conn,$sql);
        echo json_encode(mysqli_fetch_all($result,1));
    }
    //getCarousel();

    function get_index_products(){
        global $conn;
        $output=[
            //new_arrival=>[新品上架]
            //top_sale=>[热销]
            //recommended=>[推荐商品列表]
        ];

        $sql="SELECT info.pid,info.mc_pic,info.eTitle,info.cTitle,info.mc_hot_id,spec.spec_name,price.price,hot.mc_hot_name,hot.mc_hot_pic FROM mc_cake_info info,mc_cake_spec spec,mc_cake_spec_price price,mc_cake_hot hot WHERE price.pid=info.pid AND spec.spec_id=price.spec_id AND hot.mc_hot_id=info.mc_hot_id AND price.default_spec=1 AND info.mc_hot_id=1";
        $result=mysqli_query($conn,$sql);
        $products=mysqli_fetch_all($result,1);
        $output["new_arrival"]=$products;

        $sql="SELECT info.pid,info.mc_pic,info.eTitle,info.cTitle,info.mc_hot_id,spec.spec_name,price.price,hot.mc_hot_name,hot.mc_hot_pic FROM mc_cake_info info,mc_cake_spec spec,mc_cake_spec_price price,mc_cake_hot hot WHERE price.pid=info.pid AND spec.spec_id=price.spec_id AND hot.mc_hot_id=info.mc_hot_id AND price.default_spec=1 AND info.mc_hot_id=2";
        $result=mysqli_query($conn,$sql);
        $products=mysqli_fetch_all($result,1);
        $output["top_sale"]=$products;

        $sql="SELECT info.pid,info.mc_pic,info.eTitle,info.cTitle,info.mc_hot_id,spec.spec_name,price.price,hot.mc_hot_name,hot.mc_hot_pic FROM mc_cake_info info,mc_cake_spec spec,mc_cake_spec_price price,mc_cake_hot hot WHERE price.pid=info.pid AND spec.spec_id=price.spec_id AND hot.mc_hot_id=info.mc_hot_id AND price.default_spec=1 AND info.mc_hot_id=3";
        $result=mysqli_query($conn,$sql);
        $products=mysqli_fetch_all($result,1);
        $output["recommended"]=$products;

        echo json_encode($output);
    }
    //get_index_products();
?>