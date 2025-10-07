<?php

include("../header.php");
include("../databaseConnection.php");

$input = json_decode(file_get_contents('php://input'), true);

if (
    isset($input['appointment_id'], $input['client_id'],$input['pet_name'], $input['pet_type'], $input['title'], $input['desc'], $input['dr_id'], $input['desc'], $input['price'], $input['vet_note'])
) {
    $appointment_id = $input['appointment_id'];
    $client_id = $input['client_id'];
    $pet_name = $input['pet_name'];
    $pet_type = $input['pet_type'];
    $title = $input['title'];
    $description = $input['desc'];
    $dr_id = $input['dr_id'];
    $price = $input['price'];
    $vet_note = $input['vet_note'];
    $nextWeek = 1;
    $sentDate = date("Y-m-d H:i:s");

    // Insert into followup_appointment
    $insert = $conn->prepare("INSERT INTO followup_appointment (appointment_id, dr_id, client_id, pet_name, pet_type, title, description, payment, sentDate, nextWeek) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("iiissssdsi", $appointment_id, $dr_id, $client_id,  $pet_name, $pet_type, $title, $description, $price, $sentDate, $nextWeek);
    if ($insert->execute()) {

        $appointmentStatus = 1;
        $updateAppoinmentStatus = $conn->prepare("UPDATE appointments SET status = ?, note_from_vet = ? WHERE appointment_id = ?");
        $updateAppoinmentStatus->bind_param("isi", $appointmentStatus, $vet_note, $appointment_id);

        if ($updateAppoinmentStatus->execute()) {
            // $appointment_id = $stmt->insert_id;


            // $insertNotif = $conn->prepare("INSERT INTO notifications (appointment_id, reciever_id, title, description, sentDate) VALUES (?, ?, ?, ?, ?)");
            // $insertNotif->bind_param("iisss", $appointment_id, $client_id, $title, $description, $sentDate);
            // $insertNotif->execute();

            echo json_encode(['success' => true, 'message' => "Follow-up appointment successfully"]);
        } else {
            echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid input"]);
}
