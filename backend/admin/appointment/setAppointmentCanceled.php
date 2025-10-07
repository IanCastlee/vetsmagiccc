<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['appointment_id']) && isset($_GET['note_from_vet']) && isset($_GET['client_id'])) {
    $appointment_id = intval($_GET['appointment_id']);
    $client_id = intval($_GET['client_id']);
    $note_from_vet = $_GET['note_from_vet'];
    $title_for_client = "Appointment Cancellation";
    $status = 2;

    $sentDate = date("Y-m-d");


   $update_status = $conn->prepare("UPDATE appointments SET status = ?, note_from_vet = ? WHERE appointment_id = ?");
    $update_status->bind_param("isi", $status, $note_from_vet, $appointment_id);

    if ($update_status->execute()) {

            $insertNotif = $conn->prepare("INSERT INTO notifications (appointment_id, reciever_id, title, description, sentDate) VALUES (?, ?, ?, ?, ?)");
            $insertNotif->bind_param("iisss", $appointment_id, $client_id, $title_for_client, $note_from_vet, $sentDate);
            $insertNotif->execute();
            echo json_encode(['success' => true, 'message' => "Appointment cancelled"]);


    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to perform status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid  ID']);
}
