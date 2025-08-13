<?php


include("../../header.php");
include("../../databaseConnection.php");


$getShop = $conn->prepare("SELECT * FROM shop WHERE stock < 4  AND status = 1");

$getShop->execute();
$result =  $getShop->get_result();

$medicine = [];

while ($row = $result->fetch_assoc()) {
    $medicine[] = $row;
}

echo json_encode(['success' => true, 'data' => $medicine]);
