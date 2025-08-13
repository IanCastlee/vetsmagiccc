<?php

include("../../header.php");
include("../../databaseConnection.php");


$get_announcement = $conn->prepare("SELECT * FROM announcement WHERE status = 1");
$get_announcement->execute();
$result = $get_announcement->get_result();
$announcement = [];

while ($row = $result->fetch_assoc()) {
    $announcement[] = $row;
}


echo json_encode(['success' => true, 'data' => $announcement]);
