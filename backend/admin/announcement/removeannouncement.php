<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['announcement_id'])) {
    $announcement_id = intval($_GET['announcement_id']);

    // Set status to 0 in the users table
    $update_status = $conn->prepare("UPDATE announcement SET status = 0 WHERE announcement_id = ?");
    $update_status->bind_param("i", $announcement_id);

    if ($update_status->execute()) {
        echo json_encode(['success' => true, 'message' => 'Announcement status set to 0 ']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update Medicine status']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
}
