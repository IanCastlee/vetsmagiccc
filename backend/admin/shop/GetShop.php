<?php


include("../../header.php");
include("../../databaseConnection.php");


$getShop = $conn->prepare("SELECT * FROM shop WHERE status = 1 ORDER BY medicine_id DESC");

$getShop->execute();
$result =  $getShop->get_result();

$medicine = [];

while ($row = $result->fetch_assoc()) {
    $medicine[] = $row;
}

echo json_encode(['success' => true, 'data' => $medicine]);
