<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['user_id'])) {
    $user_id = intval($_GET['user_id']);

    // Set status to 0 in the users table
    $update_status = $conn->prepare("UPDATE users SET status = 1 WHERE user_id = ?");
    $update_status->bind_param("i", $user_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Set as active']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update veterinarian status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
}
