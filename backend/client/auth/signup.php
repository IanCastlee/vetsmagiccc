<?php
include("../../header.php");
include("../../databaseConnection.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['fullname'], $input['address'], $input['phone'], $input['email'])) {

    $fullname = $input['fullname'];
    $address = $input['address'];
    $phone = $input['phone'];
    $email = $input['email'];
    $verify_token = rand(1000, 9999);

    $stmt_check_email =  $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt_check_email->bind_param("s", $email);
    $stmt_check_email->execute();
    $result = $stmt_check_email->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => "Email already exists"]);
    } else {
        $stmt_insert = $conn->prepare("INSERT INTO users (fullname, address, phone, email, verify_token) VALUES (?,?,?,?,?)");
        if ($stmt_insert) {
            $stmt_insert->bind_param("sssss", $fullname, $address, $phone, $email, $verify_token);
            if ($stmt_insert->execute()) {

                $mail = new PHPMailer(true);

                try {
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = 'ml99997955@gmail.com';
                    $mail->Password   = 'sers hwlz crfu fzas';
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port       = 587;

                    $mail->setFrom('ml99997955@gmail.com', 'VETCARE');
                    $mail->addAddress($email);

                    $mail->isHTML(true);
                    $mail->Subject = 'Verify your Email - VETCARE';

                    $mail->Body = "
                        <h2>Welcome to VETCARE!</h2>
                        <p>Thank you for registering with us. To activate your account, please verify your email address using the code below:</p>
                        <p style='font-size:18px;'><strong>Your Verification Code:</strong> <b>$verify_token</b></p>
                        <p>If you did not sign up for a VETCARE account, please ignore this email.</p>
                        <p>Best regards,<br>VETCARE Team</p>
                    ";

                    $mail->AltBody = "Welcome to VETCARE!\n\n"
                        . "Thank you for registering with us. To activate your account, please verify your email address using the code below:\n"
                        . "Verification Code: $verify_token\n\n"
                        . "If you did not sign up for a VETCARE account, please ignore this email.\n\n"
                        . "Best regards,\nVETCARE";

                    $mail->send();
                    echo json_encode([
                        'success' => true,
                        'message' => "Check your email ($email) to verify your account. If you don't see the email, please check your Spam or Junk folder.",

                        'email' => $email
                    ]);
                } catch (Exception $e) {
                    echo json_encode([
                        'success' => false,
                        'message' => "Email sending failed: {$mail->ErrorInfo}"
                    ]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
            }
            $stmt_insert->close();
        } else {
            echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
