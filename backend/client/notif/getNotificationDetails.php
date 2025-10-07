<?php

include("../../header.php");
include("../../databaseConnection.php");



if(isset($_GET['appointment_id'])){

    $appointment_id = $_GET['appointment_id'];

    $get_notification = $conn->prepare("SELECT a.*, u.user_id, u.fullname AS drFullname FROM appointments AS a JOIN  users AS u ON u.user_id = a.dr_id WHERE appointment_id=?");
    $get_notification->bind_param("i", $appointment_id);
    $get_notification->execute();

    $result = $get_notification->get_result();
    $notif = [];

    while ($row = $result->fetch_assoc()) {
        $notif[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $notif]);
} else {
    echo json_encode(['success' => false, 'message' => "Appointment is empty"]);
}
