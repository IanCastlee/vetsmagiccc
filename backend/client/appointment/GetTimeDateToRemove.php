<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_GET['choosenDate'], $_GET['vetId'])) {
    $choosenDate = $_GET['choosenDate'];
    $vetId = $_GET['vetId'];

    $getNotAvailableAppointmentTime = $conn->prepare(
        "SELECT appointment_time FROM appointments WHERE appointment_date = ? AND dr_id = ?"
    );
    $getNotAvailableAppointmentTime->bind_param("si", $choosenDate, $vetId);
    $getNotAvailableAppointmentTime->execute();

    $result = $getNotAvailableAppointmentTime->get_result();
    $appointmentTime = [];

    while ($row = $result->fetch_assoc()) {
        $appointmentTime[] = $row;
    }

    echo json_encode(['success' => true, 'data' => $appointmentTime]);
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
