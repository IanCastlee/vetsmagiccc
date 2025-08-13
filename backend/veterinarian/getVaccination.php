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
        SELECT vaccination 
        FROM appointments 
        WHERE client_id = ? AND pet_name = ? AND pet_type = ?
        AND vaccination IS NOT NULL AND vaccination != ''
    ");
    $getPet->bind_param("iss", $clientId, $petName, $petType);
    $getPet->execute();
    $result = $getPet->get_result();

    $vaccinations = [];

    while ($row = $result->fetch_assoc()) {
        $vaccinations[] = $row['vaccination'];
    }

    // Remove duplicate vaccinations
    $uniqueVaccinations = array_values(array_unique($vaccinations));

    if (!empty($uniqueVaccinations)) {
        echo json_encode(['success' => true, 'data' => $uniqueVaccinations]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No vaccinations found for this pet']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}
