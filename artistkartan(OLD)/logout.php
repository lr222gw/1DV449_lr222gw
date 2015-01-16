<?php
/**
 * Created by PhpStorm.
 * User: Lowe
 * Date: 2015-01-12
 * Time: 02:16
 */
session_start();


$logout = "true";
include("getLogin.php");



session_destroy();