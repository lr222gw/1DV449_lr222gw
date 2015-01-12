<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-08
 * Time: 23:15
 */
session_start();


if($_GET["function"] == "isUserOnline"){
    if(isset($_SESSION["OnlineUser"])){
        echo json_encode($_SESSION["OnlineUser"]);
    }else{
        echo false;
    }
}
