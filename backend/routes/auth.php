<?php 
    session_start();
    header('Content-Type: application/json');
    
    
    // Would need a database and a require later


    $response = ["success" => false, "message" => ""];

    // error message 
    $error = "";

    // Variable declaration
    $first_name = $last_name = $email = $birth_date = $password = "";



// Retrieve all the information from the registration form
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $first_name = trim($_POST["first_name"] ?? ""); 
        $last_name = trim($_POST["last_name"] ??"");
        $email = trim($_POST["email"] ??"");
        $password = trim($_POST["password"] ??"");

        // Validate fields
        if (empty($first_name) || empty($last_name) || empty($email) || strlen($password) < 8) {
            $response["message"] = "Invalid input. check all fields";
        } else {
            $response["success"] = true;
            $response["message"] = "Welcome, $first_name! Registeration went succesful" ;
        }
    } else {
        $response["success"] = false;
        $response["message"] = "Invalid";
    }

    echo json_encode($response);
    exit;
?>
