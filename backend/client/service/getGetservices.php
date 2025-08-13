<?php

include("../../header.php");
include("../../databaseConnection.php");


$getServices = $conn->prepare("SELECT * FROM services WHERE status = 1");
$getServices->execute();

$result  = $getServices->get_result();
$services = [];


while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

echo json_encode(['success' => true, 'data' => $services]);
