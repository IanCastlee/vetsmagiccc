<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['appointment_id']) && isset($_GET['note_from_vet'])) {
    $appointment_id = intval($_GET['appointment_id']);
    $note_from_vet = $_GET['note_from_vet'];

    $status = 1;

    $update_status = $conn->prepare("UPDATE appointments SET status = ?, note_from_vet = ? WHERE appointment_id = ?");
    $update_status->bind_param("isi", $status, $note_from_vet, $appointment_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment marked as done']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to perform update']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input or missing parameters']);
}
