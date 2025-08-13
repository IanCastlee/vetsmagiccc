<?php
session_start();

include("../../header.php");
include("../../databaseConnection.php");
header('Content-Type: application/json');


if (isset($_POST['user_id'], $_POST['fullname'], $_POST['address'], $_POST['phone'])) {
    $userId = $_POST['user_id'];
    $fullname = $_POST['fullname'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];

    $update_image = false;
    $image_name = "";

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $image_name = $_FILES['image']['name'];
        $uniqueImageName = time() . "_" . basename($image_name);
        $image_tmp = $_FILES['image']['tmp_name'];
        $imageFolder = "../../uploads/" . $uniqueImageName;

        if (move_uploaded_file($image_tmp, $imageFolder)) {
            $update_image = true;
        } else {
            echo json_encode(['success' => false, 'message' => "File upload failed!"]);
            exit;
        }
    }

    if ($update_image) {
        $update_image = $conn->prepare("UPDATE users SET fullname = ?, address = ?, phone = ?, profile = ? WHERE user_id = ?");
        $update_image->bind_param("ssssi", $fullname, $address, $phone, $uniqueImageName, $userId);
        $update_image->execute();
        echo json_encode(['success' => true, 'message' => "Updated with profile"]);
    } else {
        $update_image = $conn->prepare("UPDATE users SET fullname = ?, address = ?, phone = ? WHERE user_id = ?");
        $update_image->bind_param("sssi", $fullname, $address, $phone, $userId);
        $update_image->execute();
        echo json_encode(['success' => true, 'message' => "Updated"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Can't fetch data from client"]);
}
