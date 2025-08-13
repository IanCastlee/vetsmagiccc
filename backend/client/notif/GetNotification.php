<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

$currentUser = $_SESSION['userid'] ?? null;

if ($currentUser) {
    $get_notification = $conn->prepare("SELECT * FROM notifications WHERE reciever_id = ? ORDER BY notif_id DESC");
    $get_notification->bind_param("i", $currentUser);
    $get_notification->execute();

    $result = $get_notification->get_result();
    $notif = [];

    while ($row = $result->fetch_assoc()) {
        $notif[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $notif]);
} else {
    echo json_encode(['success' => false, 'message' => "User ID is empty"]);
}
