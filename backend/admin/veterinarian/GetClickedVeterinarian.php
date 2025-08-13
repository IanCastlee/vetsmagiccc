<?php

include("../../header.php");
include("../../databaseConnection.php");

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['user_id'])) {
    $user_id = $input['user_id'];

    // Get veterinarian basic info
    $get_veterinarian = $conn->prepare("SELECT u.*, v.* FROM users AS u JOIN vetinfo AS v ON u.user_id = v.user_id WHERE u.user_id = ?");
    $get_veterinarian->bind_param("i", $user_id);
    $get_veterinarian->execute();
    $veterinarianResult = $get_veterinarian->get_result();
    $veterinarianInfo = $veterinarianResult->fetch_assoc();

    // Get veterinarian services separately
    $get_services = $conn->prepare("SELECT vservices_id, vservices, price FROM veterinarian_services WHERE user_id = ?");
    $get_services->bind_param("i", $user_id);
    $get_services->execute();
    $servicesResult = $get_services->get_result();

    $services = [];
    while ($row = $servicesResult->fetch_assoc()) {
        $services[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'veterinarianInfo' => $veterinarianInfo,
            'services' => $services
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
