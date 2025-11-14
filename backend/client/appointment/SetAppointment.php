<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

header("Content-Type: application/json");

if (
    isset(
        $_POST['email'],
        $_POST['client_id'],
        $_POST['dr_id'],
        $_POST['service'],
        $_POST['pet_name'],
        $_POST['pet_type'],
        $_POST['breed'],
        $_POST['age'],
        $_POST['weight'],
        $_POST['gender'],
        $_POST['current_health_issue'],
        $_POST['history_health_issue'],
        $_POST['appointment_date'],
        $_POST['appointment_time'],
        $_POST['payment_method'],
        $_POST['price'],
        $_POST['title_for_vet'],
        $_POST['message_for_vet'],
        $_POST['title_for_client'],
        $_POST['desc_for_client']
    )
) {

    $email = $_POST['email'];
    $client_id = $_POST['client_id'];
    $dr_id = $_POST['dr_id'];
    $service = $_POST['service'];
    $pet_name = $_POST['pet_name'];
    $pet_type = $_POST['pet_type'];
    $breed = $_POST['breed'];
    $age = $_POST['age'];
    $weight = $_POST['weight'];
    $gender = $_POST['gender'];
    $current_health_issue = $_POST['current_health_issue'];
    $history_health_issue = $_POST['history_health_issue'];
    $appointment_date = $_POST['appointment_date'];
    $appointment_time = $_POST['appointment_time'];
    $payment_method = $_POST['payment_method'];
    $price = $_POST['price'];
    $title_for_vet = $_POST['title_for_vet'];
    $message_for_vet = $_POST['message_for_vet'];
    $title_for_client = $_POST['title_for_client'];
    $desc_for_client = $_POST['desc_for_client'];

    date_default_timezone_set("Asia/Manila");
    $sentDate = date("Y-m-d");

    // Upload image if exists
    $image_name = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {

        $uploadDir = '../../uploads/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $tmp_name = $_FILES['image']['tmp_name'];
        $original_name = basename($_FILES['image']['name']);
        $image_ext = pathinfo($original_name, PATHINFO_EXTENSION);
        $new_filename = uniqid("appointment_", true) . '.' . $image_ext;

        $uploadPath = $uploadDir . $new_filename;

        if (move_uploaded_file($tmp_name, $uploadPath)) {
            $image_name = $new_filename;
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
            exit;
        }
    }

    // Insert Appointment
    $stmt = $conn->prepare("INSERT INTO appointments (
        client_id, dr_id, service, pet_name, pet_type, breed, age, weight, gender,
        current_health_issue, history_health_issue, appointment_date, appointment_time,
        payment_method, paid_payment, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "iissssssssssssss",
        $client_id,
        $dr_id,
        $service,
        $pet_name,
        $pet_type,
        $breed,
        $age,
        $weight,
        $gender,
        $current_health_issue,
        $history_health_issue,
        $appointment_date,
        $appointment_time,
        $payment_method,
        $price,
        $image_name
    );

    if ($stmt->execute()) {

        $appointment_id = $stmt->insert_id;

        // Create Notification for Vet
        $insertNotification = $conn->prepare("
            INSERT INTO notifications (appointment_id, sender_id, reciever_id, title, description, sentDate) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $insertNotification->bind_param("iiisss", $appointment_id, $client_id, $dr_id, $title_for_vet, $message_for_vet, $sentDate);

        if ($insertNotification->execute()) {

            // Create Notification for Client
            $insertNotif = $conn->prepare("
                INSERT INTO notifications (appointment_id, reciever_id, title, description, sentDate) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $insertNotif->bind_param("iisss", $appointment_id, $client_id, $title_for_client, $desc_for_client, $sentDate);
            $insertNotif->execute();

            // SEND EMAIL TO CLIENT
            $mail = new PHPMailer(true);

            try {

                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'ml99997955@gmail.com';
                $mail->Password   = 'sers hwlz crfu fzas'; // APP PASSWORD
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('ml99997955@gmail.com', 'VETCARE');
                $mail->addAddress($email);

                $mail->isHTML(true);
                $mail->Subject = "Your Appointment Confirmation - VETCARE";

                $mail->Body = "
                    <h2>Your appointment has been set. Please prepare for your chosen date.</h2>
                    <p>Thank you for booking with VETCARE. Below are your appointment details:</p>

                    <h3>Appointment Information:</h3>
                    <p><strong>Service:</strong> $service</p>
                    <p><strong>Pet Name:</strong> $pet_name</p>
                    <p><strong>Pet Type:</strong> $pet_type</p>
                    <p><strong>Breed:</strong> $breed</p>
                    <p><strong>Age:</strong> $age</p>
                    <p><strong>Weight:</strong> $weight</p>
                    <p><strong>Gender:</strong> $gender</p>

                    <h3>Schedule:</h3>
                    <p><strong>Date:</strong> $appointment_date</p>
                    <p><strong>Time:</strong> $appointment_time</p>

                    <h3>Payment:</h3>
                    <p><strong>Payment Method:</strong> $payment_method</p>
                    <p><strong>Amount:</strong> ₱$price</p>

                    <br>
                    <p>If you have any questions, feel free to reply to this email.</p>
                    <p><strong>VETCARE Team</strong></p>
                ";

                $mail->send();

            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => "Appointment saved but email failed: {$mail->ErrorInfo}"
                ]);
                exit;
            }

            echo json_encode([
                'success' => true,
                'message' => "Appointment set successfully! Email sent to client.",
                'appointment_id' => $appointment_id
            ]);

        }

    } else {
        echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
    }

    $stmt->close();

} else {
    echo json_encode(['success' => false, 'message' => "Missing required fields"]);
}
