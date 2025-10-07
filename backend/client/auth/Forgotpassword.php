<?php
include("../../header.php");
include("../../databaseConnection.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['email'], $input['password'])) {


    $email = $input['email'];
    // $password = password_hash($input['password'], PASSWORD_DEFAULT);
    $verify_token = rand(1000, 9999);

    $stmt_check_email =  $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt_check_email->bind_param("s", $email);
    $stmt_check_email->execute();
    $result = $stmt_check_email->get_result();

    if ($result->num_rows > 0) {
        $update_status = $conn->prepare("UPDATE users SET  verify_token = ? WHERE email = ?");
        if ($update_status) {
            $update_status->bind_param("ss", $verify_token, $email);
            if ($update_status->execute()) {

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
                    $mail->Subject = 'Password Reset Verification Code - VETCARE';

                    $mail->Body = "
                        <h2>Password Reset Request - VETCARE</h2>
                        <p>We received a request to reset your password. Use the verification code below to proceed:</p>
                        <p style='font-size:18px;'><strong>Your Verification Code:</strong> <b>$verify_token</b></p>
                        <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
                        <p>Best regards,<br>VETCARE Team</p>
                    ";

                    $mail->AltBody = "Password Reset Request - VETCARE\n\n"
                        . "We received a request to reset your password. Use the verification code below to proceed:\n"
                        . "Verification Code: $verify_token\n\n"
                        . "If you did not request a password reset, please ignore this email or contact our support team.\n\n"
                        . "Best regards,\nVETCARE";

                    $mail->send();
                    echo json_encode([
                        'success' => true,
                        'message' => "A password reset code has been sent to your email ($email). Please check your inbox to proceed.",
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
            $update_status->close();
        } else {
            echo json_encode(['success' => false, 'message' => "Prepare failed: " . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "Email not registered"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
