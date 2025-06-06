<?php

include("../header.php");
include("../databaseConnection.php");

$input = json_decode(file_get_contents('php://input'), true);


if (isset($input['currentVet_id'])) {

    $currentVet_id = $input['currentVet_id'];
    $status = 0;


    $getAppointment = $conn->prepare("SELECT a.*, u.user_id AS vetId,u.fullname AS drFullname, u2.user_id AS clientId, u2.address AS clientAddres, u2.fullname AS petOwner, u2.phone FROM appointments AS a JOIN users AS u ON a.dr_id = u.user_id JOIN users AS u2 ON u2.user_id = a.client_id  WHERE a.dr_id = ? AND a.status = ?");
    $getAppointment->bind_param("ii", $currentVet_id, $status);
    $getAppointment->execute();
    $result =  $getAppointment->get_result();

    $appointments = [];

    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $appointments]);
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
