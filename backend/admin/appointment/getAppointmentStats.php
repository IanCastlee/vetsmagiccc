<?php

include("../../header.php");
include("../../databaseConnection.php");

header('Content-Type: application/json');

$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');

$data = [
    'daily' => [],
    'monthly' => [],
    'yearly' => 0,
];

try {
    // DAILY STATS
    $stmt = $conn->prepare("
        SELECT DATE(appointment_date) AS day, COUNT(*) AS total_appointments, SUM(paid_payment) AS total_payment
        FROM appointments
        WHERE status = 1 AND YEAR(appointment_date) = ?
        GROUP BY DATE(appointment_date)
        ORDER BY day ASC
    ");
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $result = $stmt->get_result();
    $data['daily'] = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // MONTHLY STATS
    $stmt = $conn->prepare("
        SELECT MONTH(appointment_date) AS month, COUNT(*) AS total_appointments, SUM(paid_payment) AS total_payment
        FROM appointments
        WHERE status = 1 AND YEAR(appointment_date) = ?
        GROUP BY MONTH(appointment_date)
    ");
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $result = $stmt->get_result();
    $data['monthly'] = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();

    // YEARLY TOTAL PAYMENT
    $stmt = $conn->prepare("
        SELECT SUM(paid_payment) AS total_payment
        FROM appointments
        WHERE status = 1 AND YEAR(appointment_date) = ?
    ");
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $stmt->bind_result($total_payment);
    $stmt->fetch();
    $data['yearly'] = $total_payment ?? 0;
    $stmt->close();

    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
