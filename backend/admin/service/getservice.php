<?php

include("../../header.php");
include("../../databaseConnection.php");


$get_services = $conn->prepare("SELECT * FROM services WHERE status = 1");
$get_services->execute();
$result = $get_services->get_result();
$services = [];

while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}


echo json_encode(['success' => true, 'data' => $services]);
