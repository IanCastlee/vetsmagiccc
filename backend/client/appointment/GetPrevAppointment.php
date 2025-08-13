<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['user_id'], $_GET['petType'])) {

    $user_id = $_GET['user_id'];
    $petType = $_GET['petType'];
    $status = 0;

    // Step 1: Get the latest appointment per pet (grouped by pet_name, pet_type, breed, gender)
    if ($petType === "General") {
        $getPets = $conn->prepare("
            SELECT a.pet_name, a.pet_type, a.breed, a.age, a.weight, a.gender, 
                   a.current_health_issue, a.history_health_issue, a.image 
            FROM appointments a
            INNER JOIN (
                SELECT pet_name, pet_type, breed, gender, MAX(appointment_id) AS max_id
                FROM appointments 
                WHERE client_id = ? AND is_followup = ?
                GROUP BY pet_name, pet_type, breed, gender
            ) latest 
            ON a.pet_name = latest.pet_name 
               AND a.pet_type = latest.pet_type
               AND a.breed = latest.breed 
               AND a.gender = latest.gender 
               AND a.appointment_id = latest.max_id
            WHERE a.client_id = ? AND a.is_followup = ?
        ");
        $getPets->bind_param("iiii", $user_id, $status, $user_id, $status);
    } else {
        $getPets = $conn->prepare("
            SELECT a.pet_name, a.pet_type, a.breed, a.age, a.weight, a.gender, 
                   a.current_health_issue, a.history_health_issue, a.image 
            FROM appointments a
            INNER JOIN (
                SELECT pet_name, pet_type, breed, gender, MAX(appointment_id) AS max_id
                FROM appointments 
                WHERE client_id = ? AND pet_type = ? AND is_followup = ?
                GROUP BY pet_name, pet_type, breed, gender
            ) latest 
            ON a.pet_name = latest.pet_name 
               AND a.pet_type = latest.pet_type
               AND a.breed = latest.breed 
               AND a.gender = latest.gender 
               AND a.appointment_id = latest.max_id
            WHERE a.client_id = ? AND a.pet_type = ? AND a.is_followup = ?
        ");
        $getPets->bind_param("isiiis", $user_id, $petType, $status, $user_id, $petType, $status);
    }

    $getPets->execute();
    $petsResult = $getPets->get_result();

    $finalData = [];

    // Step 2: For each unique pet, get their services
    while ($pet = $petsResult->fetch_assoc()) {
        $getServices = $conn->prepare("
            SELECT service FROM appointments 
            WHERE client_id = ? 
              AND pet_name = ? 
              AND pet_type = ?
              AND breed = ? 
              AND gender = ?
        ");
        $getServices->bind_param(
            "issss",
            $user_id,
            $pet['pet_name'],
            $pet['pet_type'],
            $pet['breed'],
            $pet['gender']
        );
        $getServices->execute();
        $servicesResult = $getServices->get_result();

        $services = [];
        while ($serviceRow = $servicesResult->fetch_assoc()) {
            $serviceName = trim($serviceRow['service']);
            if (!in_array($serviceName, $services)) {
                $services[] = $serviceName;
            }
        }

        $finalData[] = [
            'pet_name' => $pet['pet_name'],
            'pet_type' => $pet['pet_type'],
            'breed' => $pet['breed'],
            'age' => $pet['age'],
            'weight' => $pet['weight'],
            'gender' => $pet['gender'],
            'current_health_issue' => $pet['current_health_issue'],
            'history_health_issue' => $pet['history_health_issue'],
            'image' => $pet['image'],
            'services' => $services,
        ];
    }

    echo json_encode(['success' => true, 'data' => $finalData]);

} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
