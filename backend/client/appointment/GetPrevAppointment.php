<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['user_id'], $_GET['petType'])) {

    $user_id = $_GET['user_id'];
    $petType = $_GET['petType'];
    $status = 0;

    $getPrevAppointment = $conn->prepare("SELECT pet_name, pet_type, breed, age, weight, gender, current_health_issue, history_health_issue, image 
  FROM appointments WHERE client_id = ? AND pet_type = ? AND is_followup = ?");
    $getPrevAppointment->bind_param("isi", $user_id, $petType, $status);
    $getPrevAppointment->execute();
    $result =  $getPrevAppointment->get_result();

    $appointments = [];

    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $appointments]);
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
