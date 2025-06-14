<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['service_id'])) {
    $service_id = intval($_GET['service_id']);

    // Set status to 0 in the users table
    $update_status = $conn->prepare("UPDATE services SET status = 0 WHERE service_id = ?");
    $update_status->bind_param("i", $service_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Service status set to 0 (soft deleted)']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update Medicine status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
}
