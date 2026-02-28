<?php 
    session_start();
    header('Content-Type: application/json');

    $response = ["success" => false, "message" => ""];
    
    
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $email = trim($_POST["email"] ?? "");
        $password = trim($_POST["password"] ??"");


        // Validate responses
        if (empty($email) || empty($password)) {
            $response["message"] = "Invalid login. please try again";

        } else {
            $response["success"] = true;
            $response["message"] = "logged in successfully.";
        }
    } else {
        $response["message"] = false;
        $response["success"] = "Invalid";
    }

    echo json_encode($response);
    exit;



?>