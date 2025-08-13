<?php

include("../../header.php");
include("../../databaseConnection.php");



if (isset($_POST['id'], $_POST['announcement_name'], $_POST['description'])) {


    $id = $_POST['id'];
    $announcement_name = $_POST['announcement_name'];
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
        $update_announcement = $conn->prepare("UPDATE announcement SET title=?, description =?, image=? WHERE announcement_id =?");
        $update_announcement->bind_param("sssi",  $announcement_name, $description, $unique_image_name, $id);
    } else {
        $update_announcement = $conn->prepare("UPDATE announcement SET title=?, description=? WHERE announcement_id = ?");
        $update_announcement->bind_param("ssi",  $announcement_name, $description, $id);
    }

    if ($update_announcement->execute()) {
        echo json_encode(['success' => true, 'message' => "Announcement Updated"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update Medicine info"]);
    }
} else {
    echo json_encode(['success' => true, 'message' => "Cant get data from frontend"]);
}
