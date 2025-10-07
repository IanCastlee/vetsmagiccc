<?php

include("../../header.php");
include("../../databaseConnection.php");


$get_treated_pet = $conn->prepare("SELECT * FROM treated_pets WHERE status = 1");
$get_treated_pet->execute();
$result = $get_treated_pet->get_result();
$treated_pet = [];

while ($row = $result->fetch_assoc()) {
    $treated_pet[] = $row;
}


echo json_encode(['success' => true, 'data' => $treated_pet]);
