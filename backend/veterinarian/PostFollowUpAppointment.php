<?php

include("../header.php");
include("../databaseConnection.php");

$input = json_decode(file_get_contents('php://input'), true);

if (
    isset($input['appointment_id'], $input['client_id'],$input['pet_name'], $input['pet_type'], $input['title'], $input['desc'], $input['dr_id'], $input['desc'], $input['price'])
) {
    $appointment_id = $input['appointment_id'];
    $client_id = $input['client_id'];
    $pet_name = $input['pet_name'];
    $pet_type = $input['pet_type'];
    $title = $input['title'];
    $description = $input['desc'];
    $dr_id = $input['dr_id'];
    $price = $input['price'];
    $nextWeek = 1;
    $sentDate = date("Y-m-d H:i:s");

    // Insert into followup_appointment
    $insert = $conn->prepare("INSERT INTO followup_appointment (appointment_id, dr_id, client_id, pet_name, pet_type, title, description, payment, sentDate, nextWeek) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("iiissssdsi", $appointment_id, $dr_id, $client_id,  $pet_name, $pet_type, $title, $description, $price, $sentDate, $nextWeek);
    if ($insert->execute()) {

        $appointmentStatus = 1;
        $updateAppoinmentStatus = $conn->prepare("UPDATE appointments SET status = ? WHERE appointment_id = ?");
        $updateAppoinmentStatus->bind_param("ii", $appointmentStatus, $appointment_id);
        if ($updateAppoinmentStatus->execute()) {
            $insertNotif = $conn->prepare("INSERT INTO notifications ( reciever_id, title, description, sentDate) VALUES (?, ?, ?, ?)");
            $insertNotif->bind_param("isss", $client_id, $title, $description, $sentDate);
            $insertNotif->execute();

            echo json_encode(['success' => true, 'message' => "Follow-up appointment and notification added successfully"]);
        } else {
            echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid input"]);
}
