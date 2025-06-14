<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_POST['id'], $_POST['service_name'], $_POST['description'])) {


    $id = $_POST['id'];
    $service_name = $_POST['service_name'];
    $id = $_POST['id'];
    $description = $_POST['description'];


    $update_image = false;
    $image_name = "";

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $image_name = $_FILES['image']['name'];
        $unique_image_name = time() . "_" . basename($image_name);
        $image_tmp = $_FILES['image']['tmp_name'];
        $image_folder = "../../uploads/" . $unique_image_name;

        if (move_uploaded_file($image_tmp, $image_folder)) {
            $update_image = true;
        } else {
            echo json_encode(['success' => false, 'message' => "File upload failed!"]);
            exit;
        }
    }

    if ($update_image) {
        $update_service = $conn->prepare("UPDATE services SET name=?, description, image WHERE service_id =?");
        $update_service->bind_param("sssi",  $service_name, $description, $unique_image_name, $id);
    } else {
        $update_service = $conn->prepare("UPDATE services SET name=?, description=? WHERE service_id = ?");
        $update_service->bind_param("ssi",  $service_name, $description, $id);
    }

    if ($update_service->execute()) {
        echo json_encode(['success' => true, 'message' => "Service Updated"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update Medicine info"]);
    }
} else {
    echo json_encode(['success' => true, 'message' => "Cant get data from frontend"]);
}
