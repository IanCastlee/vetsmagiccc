<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['notifId'])) {

    $notifId = $_GET['notifId'];
    $newStatus = 1;

    $updateStatus = $conn->prepare("UPDATE notifications SET status = $newStatus WHERE notif_id = $notifId");
    if ($updateStatus->execute()) {
        echo json_encode(['success' => true, 'message' => 'Updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Databse error' . $conn->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Notification ID is empty']);
}
