<?php

include("../header.php");
include("../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data['client_id']) &&
    isset($data['pet_name']) &&
    isset($data['pet_type'])
) {
    $clientId = $data['client_id'];
    $petName = $data['pet_name'];
    $petType = $data['pet_type'];

    $getPet = $conn->prepare("
        SELECT allergies 
        FROM appointments 
        WHERE client_id = ? AND pet_name = ? AND pet_type = ?
        AND allergies IS NOT NULL AND allergies != ''
    ");
    $getPet->bind_param("iss", $clientId, $petName, $petType);
    $getPet->execute();
    $result = $getPet->get_result();

    $allergies = [];

    while ($row = $result->fetch_assoc()) {
        $allergies[] = $row['allergies'];
    }

    // Remove duplicate vaccinations
    $uniqueAllergies = array_values(array_unique($allergies));

    if (!empty($uniqueAllergies)) {
        echo json_encode(['success' => true, 'data' => $uniqueAllergies]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No allergies found for this pet']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
