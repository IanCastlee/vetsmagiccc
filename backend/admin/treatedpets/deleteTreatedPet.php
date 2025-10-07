<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['pet_id'])) {
    $pet_id = intval($_GET['pet_id']);

    // Set status to 0 in the users table
    $update_status = $conn->prepare("UPDATE treated_pets SET status = 0 WHERE pet_id = ?");
    $update_status->bind_param("i", $pet_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Pet status set to 0 (soft deleted)']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update Pet status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
}
