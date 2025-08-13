<?php

include("../../header.php");
include("../../databaseConnection.php");

// First, get all veterinarians
$get_veterinarian = $conn->prepare("SELECT u.*, v.* FROM users AS u 
    JOIN vetinfo AS v ON u.user_id = v.user_id 
    WHERE u.acc_type = 1 AND status = 1");

$get_veterinarian->execute();
$result = $get_veterinarian->get_result();

$vets = [];

// Build basic vet data
while ($row = $result->fetch_assoc()) {
    $user_id = $row['user_id'];
    $vets[$user_id] = $row;
    $vets[$user_id]['services'] = [];
}

// Now get all services and group them
$get_services = $conn->prepare("SELECT * FROM veterinarian_services");
$get_services->execute();
$services_result = $get_services->get_result();

while ($service = $services_result->fetch_assoc()) {
    $user_id = $service['user_id'];
    if (isset($vets[$user_id])) {
        $vets[$user_id]['services'][] = $service;
    }
}

$vets = array_values($vets);

echo json_encode(['success' => true, 'data' => $vets]);
