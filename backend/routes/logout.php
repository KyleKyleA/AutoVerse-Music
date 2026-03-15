<?php 
    session_start();
    header("location: index.php");

    session_unset();

    session_destroy();

    session_start();

    $_SESSION["message"] = "you have logged out";

    header("location: ./login.php");

    ob_flush();




?>