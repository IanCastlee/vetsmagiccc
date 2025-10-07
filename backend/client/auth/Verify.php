<?php
include("../../header.php");
include("../../databaseConnection.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php'; 

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['otp'], $input['email'])) {

    $otp = $input['otp'];  
    $email = $input['email'];
     $password = password_hash($input['password'], PASSWORD_DEFAULT);

    $check_otp = $conn->prepare("SELECT * FROM users WHERE email = ? AND verify_token = ?");
    $check_otp->bind_param('ss', $email, $otp);
    $check_otp->execute();
    $result = $check_otp->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();  

        

        // if ($row['status'] == 0) {  
            $update_status = $conn->prepare("UPDATE users SET password = ?, status = 1 WHERE email = ? AND verify_token = ?");
            $update_status->bind_param('sss', $password, $email, $otp);

            if ($update_status->execute()) {
                echo json_encode(['success' => true, 'message' => ""]);
            } else {
                echo json_encode(['success' => false, 'message' => "Error updating verification status"]);
            }

            $update_status->close();
        // } else {
        //     echo json_encode(['success' => false, 'message' => "Your account is already verified"]);
        // }

    } else {
        echo json_encode(['success' => false, 'message' => "Your OTP is not registered"]);
    }

    $check_otp->close();

} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
