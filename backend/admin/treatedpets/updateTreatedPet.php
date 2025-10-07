<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_POST['id'], $_POST['pet_name'])) {

    $id = $_POST['id'];
    $pet_name = $_POST['pet_name'];

    if ($pet_name && $id) {
        $update_service = $conn->prepare("UPDATE treated_pets SET petname = ? WHERE pet_id = ?");
        $update_service->bind_param("si", $pet_name, $id);

        if ($update_service->execute()) {
            echo json_encode(['success' => true, 'message' => "Treated Pet Updated"]);
        } else {
            echo json_encode(['success' => false, 'message' => "Failed to update Treated info"]);
        }

        $update_service->close(); 
    } else {
        echo json_encode(['success' => false, 'message' => "Missing data for update"]);
    }

} else {
    echo json_encode(['success' => false, 'message' => "Can't get data from frontend"]);
}
