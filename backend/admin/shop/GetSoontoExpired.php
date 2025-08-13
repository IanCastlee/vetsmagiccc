<?php

include("../../header.php");
include("../../databaseConnection.php");

// Set the date range: today to 30 days from today
$today = date('Y-m-d');
$soon = date('Y-m-d', strtotime('+30 days'));

// Assuming 'expdate' is the column for expiration date
$getShop = $conn->prepare("SELECT * FROM shop WHERE expiration_date BETWEEN ? AND ? AND status = 1");
$getShop->bind_param("ss", $today, $soon);

$getShop->execute();
$result = $getShop->get_result();

$medicine = [];

while ($row = $result->fetch_assoc()) {
    $medicine[] = $row;
}

echo json_encode(['success' => true, 'data' => $medicine]);
