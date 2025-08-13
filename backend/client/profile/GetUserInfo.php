<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['userId'])) {
    $userId = $_GET['userId'];

    $getUserInfo = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
    $getUserInfo->bind_param("i", $userId);
    $getUserInfo->execute();

    $result = $getUserInfo->get_result();
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $data]);
} else {
    echo json_encode(['success' => false, 'message' => "Can't fetch data from client"]);
}
