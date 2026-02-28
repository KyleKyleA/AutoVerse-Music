<?php 
    session_start();
    header('Content-Type: application/json');

    $response = [
        "isLoggedIn" => isset($_SESSION["user_id"]),
        "user_name" => $_SESSION["user"] ?? null
    ];
    echo json_encode($response);
    exit;
?>