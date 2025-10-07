<?php
include("./header.php");
include("./databaseConnection.php");

header('Content-Type: application/json');

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// Get POST data (assumes JSON)
$data = json_decode(file_get_contents('php://input'), true);

$id = $conn->real_escape_string($data['id'] ?? '');
$name = $conn->real_escape_string($data['name'] ?? '');
$payment = floatval($data['payment'] ?? 0);
$method = $conn->real_escape_string($data['method'] ?? '');

// Validate data - prevent empty or invalid inserts
if (empty($id) || empty($name) || $payment <= 0 || empty($method)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid payment data. Insert aborted.']);
    exit;
}

$sql = "INSERT INTO payment (id, name, payment, method) VALUES ('$id', '$name', '$payment', '$method')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['status' => 'success', 'message' => 'Payment saved successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}

$conn->close();
