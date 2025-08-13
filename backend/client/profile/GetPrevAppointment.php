<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['user_id'])) {
    $user_id = $_GET['user_id'];

    // Get latest appointment per pet with pet_name, pet_type, breed, gender
    $getLatestAppointments = $conn->prepare("
        SELECT a.*
        FROM appointments a
        INNER JOIN (
            SELECT 
                pet_name, 
                COALESCE(pet_type, '') AS pet_type, 
                COALESCE(breed, '') AS breed, 
                COALESCE(gender, '') AS gender, 
                MAX(appointment_id) AS max_appointment_id
            FROM appointments
            WHERE client_id = ?
            GROUP BY pet_name, pet_type, breed, gender
        ) latest 
        ON a.pet_name = latest.pet_name 
           AND COALESCE(a.pet_type, '') = latest.pet_type
           AND COALESCE(a.breed, '') = latest.breed
           AND COALESCE(a.gender, '') = latest.gender
           AND a.appointment_id = latest.max_appointment_id
        WHERE a.client_id = ?
        ORDER BY a.appointment_id DESC
    ");

    $getLatestAppointments->bind_param("ii", $user_id, $user_id);
    $getLatestAppointments->execute();
    $result = $getLatestAppointments->get_result();

    $appointments = [];

    while ($row = $result->fetch_assoc()) {
        $pet_name = $row['pet_name'];
        $pet_type = $row['pet_type'] ?? '';
        $breed = $row['breed'] ?? '';
        $gender = $row['gender'] ?? '';

        // Get booking history for this pet, matching all 4 fields (handle NULL as empty string)
        $getHistory = $conn->prepare("
            SELECT * FROM appointments
            WHERE client_id = ? 
              AND pet_name = ? 
              AND COALESCE(pet_type, '') = ? 
              AND COALESCE(breed, '') = ? 
              AND COALESCE(gender, '') = ?
            ORDER BY appointment_id DESC
        ");
        $getHistory->bind_param("issss", $user_id, $pet_name, $pet_type, $breed, $gender);
        $getHistory->execute();
        $historyResult = $getHistory->get_result();

        $booking_history = [];
        while ($historyRow = $historyResult->fetch_assoc()) {
            $booking_history[] = $historyRow;
        }

        $row['booking_history'] = $booking_history;

        $appointments[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $appointments]);
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
