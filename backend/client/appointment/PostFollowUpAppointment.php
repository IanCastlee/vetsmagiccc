<?php
include("../../header.php");
include("../../databaseConnection.php");

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$appointment_id = $data['appointment_id'];
$appointment_date = $data['date'];
$appointment_time = $data['time_slot'];
$fa_id = $data['fa_id'];
$payment = $data['payment'];
$status = 0;
$status_set = 1;


if (!$appointment_id || !$appointment_date || !$appointment_time || !$fa_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields."
    ]);
    exit;
}

try {
    // Get the original appointment data
    $stmt = $conn->prepare("SELECT * FROM appointments WHERE appointment_id = ?");
    $stmt->bind_param("i", $appointment_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $original = $result->fetch_assoc();
    if (!$original) {
        echo json_encode([
            "success" => false,
            "message" => "Original appointment not found."
        ]);
        exit;
    }

    //  Remove 'appointment_id' and update desired fields
    unset($original['appointment_id']);
    $original['appointment_date'] = $appointment_date;
    $original['appointment_time'] = $appointment_time;
    $original['paid_payment'] = $payment;
    $original['is_followup'] = $status;

    // 3. Build insert query
    $columns = implode(", ", array_keys($original));
    $placeholders = implode(", ", array_fill(0, count($original), "?"));
    $types = str_repeat("s", count($original));
    $values = array_values($original);

    $insert = $conn->prepare("INSERT INTO appointments ($columns) VALUES ($placeholders)");
    $insert->bind_param($types, ...$values);

    if ($insert->execute()) {
        $updateFollowUp = $conn->prepare("UPDATE followup_appointment SET status = ? WHERE fa_id = ?");
        $updateFollowUp->bind_param("ii",  $status_set, $fa_id);
        $updateFollowUp->execute();
        echo json_encode([
            "success" => true,
            "message" => "Follow-up appointment created successfully."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
