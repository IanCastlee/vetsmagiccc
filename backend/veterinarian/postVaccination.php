<?php

include("../header.php");
include("../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['appointment_id']) && isset($data['vaccination'])) {
    $appointmentId = $data['appointment_id'];
    $vaccination = $data['vaccination'];

    $updateVaccination = $conn->prepare("UPDATE appointments SET vaccination = ? WHERE appointment_id = ?");
    $updateVaccination->bind_param("si", $vaccination, $appointmentId);

    if ($updateVaccination->execute()) {
        echo json_encode(['success' => true, 'message' => 'Vaccination updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update vaccination']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing appointment_id or vaccination']);
}
