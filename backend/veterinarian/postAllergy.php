<?php

include("../header.php");
include("../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['appointment_id']) && isset($data['allergies'])) {
    $appointmentId = $data['appointment_id'];
    $allergies = $data['allergies'];

    $updateAllergy = $conn->prepare("UPDATE appointments SET allergies = ? WHERE appointment_id = ?");
    $updateAllergy->bind_param("si", $allergies, $appointmentId);

    if ($updateAllergy->execute()) {
        echo json_encode(['success' => true, 'message' => 'Allergies updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update Allergies']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing appointment_id or Allergies']);
}
