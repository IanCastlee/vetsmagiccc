<?php

include("../../header.php");
include("../../databaseConnection.php");

$input = json_decode(file_get_contents('php://input'), true);


if (isset($input['currentUser'])) {

    $client_id = $input['currentUser'];

    $getAppointment = $conn->prepare("SELECT a.*, u1.fullname AS drFullname, u1.profile, vi.time, vi.duration, vi.specialization, u2.user_id as clientId FROM appointments AS a LEFT JOIN vetinfo AS vi ON vi.user_id = a.dr_id LEFT JOIN users AS u1 ON a.dr_id = u1.user_id LEFT JOIN users AS u2 ON a.client_id = u2.user_id WHERE u2.user_id = $client_id");

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
