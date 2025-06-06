<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_GET['service_id'])) {
    $service_id = intval($_GET['service_id']);

    $deleteServices = $conn->prepare("DELETE FROM veterinarian_services WHERE vservices_id = ?");
    $deleteServices->bind_param("i", $service_id);

    if ($deleteServices->execute()) {
        echo json_encode(['success' => true, 'message' => 'Deleted succesfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Cant insert to database']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid user ID']);
}
