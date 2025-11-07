<?php
include("../../header.php");
include("../../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['appointment_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing appointment ID']);
    exit;
}

$appointment_id = $data['appointment_id'];
$status = 3; 

$update = $conn->prepare("UPDATE appointments SET status = ? WHERE appointment_id = ?");
$update->bind_param("ii", $status, $appointment_id);

if ($update->execute()) {
    echo json_encode(['success' => true, 'message' => 'Appointment marked as refunded']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update appointment']);
}

$update->close();
$conn->close();
