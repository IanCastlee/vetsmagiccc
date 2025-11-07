<?php
include("../../header.php");
include("../../databaseConnection.php");

// Fetch appointments with status 2 (cancelled) or 3 (refunded)
$getappointment = $conn->prepare("
    SELECT 
        a.*, 
        u1.fullname AS clientName, 
        u2.profile, 
        u2.fullname AS drFullname 
    FROM appointments AS a 
    LEFT JOIN users AS u1 ON a.client_id = u1.user_id 
    LEFT JOIN users AS u2 ON u2.user_id = a.dr_id 
    WHERE a.status IN (2, 3)
    ORDER BY 
        CASE 
            WHEN a.status = 2 THEN 0 
            WHEN a.status = 3 THEN 1 
        END,
        a.appointment_id DESC
");

$getappointment->execute();
$result = $getappointment->get_result();

$appointment = [];
while ($row = $result->fetch_assoc()) {
    $appointment[] = $row;
}

echo json_encode(['success' => true, 'data' => $appointment]);
