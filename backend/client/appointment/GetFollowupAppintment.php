<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");

$currentUserID = $_GET['currentUser_id'] ?? null;

if ($currentUserID) {
    $getFollowupAppointment = $conn->prepare("SELECT fa.*, a.pet_name, a.breed, a.image, vi.time,vi.duration FROM followup_appointment AS fa JOIN appointments AS a ON a.appointment_id = fa.appointment_id JOIN vetinfo AS vi ON vi.user_id = fa.dr_id WHERE fa.client_id = ? ORDER BY fa.sentDate DESC");
    $getFollowupAppointment->bind_param("i", $currentUserID);

    $getFollowupAppointment->execute();

    $result =  $getFollowupAppointment->get_result();
    $followUp = [];


    while ($row = $result->fetch_assoc()) {
        $followUp[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $followUp]);
} else {
    echo  json_encode(['success' => false, 'message' => "No User found!"]);
}
