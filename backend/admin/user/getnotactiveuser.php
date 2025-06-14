<?php

include("../../header.php");
include("../../databaseConnection.php");

$get_active_user = $conn->prepare("SELECT * FROM users WHERE acc_type = 0 AND status = 0");
$get_active_user->execute();
$result = $get_active_user->get_result();

$users = [];


while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}
echo json_encode(['success' => true, 'data' => $users]);
