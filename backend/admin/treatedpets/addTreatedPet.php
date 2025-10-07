<?php

include("../../header.php");
include("../../databaseConnection.php");

header("Content-Type: application/json");

if (isset($_POST['pet_name']) && !empty(trim($_POST['pet_name']))) {
    $pet_name = trim($_POST['pet_name']);

    $stmt = $conn->prepare("INSERT INTO treated_pets (petname) VALUES (?)");
    $stmt->bind_param("s", $pet_name);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Treated pet added successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to add treated pet.',
            'error' => $stmt->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing or empty pet_name.'
    ]);
}
