<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

header("Content-Type: application/json");

if (
    isset(
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
        $_POST['desc_for_client'],
    )
) {
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

    $stmt = $conn->prepare("INSERT INTO appointments (
        client_id, dr_id, service, pet_name, pet_type, breed, age, weight, gender,
        current_health_issue, history_health_issue, appointment_date, appointment_time,
        payment_method, paid_payment, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "iissssisssssssss",
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

        $insertNotification = $conn->prepare("INSERT INTO notifications (sender_id, reciever_id, title, description, sentDate)VALUES(?,?,?,?,?)");
        $insertNotification->bind_param("iisss", $client_id, $dr_id, $title_for_vet, $message_for_vet, $sentDate);


        if ($insertNotification->execute()) {
            $insertNotif = $conn->prepare("INSERT INTO notifications ( reciever_id, title, description, sentDate) VALUES (?, ?, ?, ?)");
            $insertNotif->bind_param("isss", $client_id, $title_for_client, $desc_for_client, $sentDate);
            $insertNotif->execute();
            echo json_encode(['success' => true, 'message' => "Appointment sent successfully"]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => "Missing required fields"]);
}
