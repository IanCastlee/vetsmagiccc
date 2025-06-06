<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['appointment_id'])) {
    $appointment_id = intval($_GET['appointment_id']);
    $status = 1;

    // Set status to 0 in the users table
    $update_status = $conn->prepare("UPDATE appointments SET status = ?  WHERE appointment_id = ?");
    $update_status->bind_param("ii", $status, $appointment_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment mark as done']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to perform status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid  ID']);
}
