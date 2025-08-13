<?php

include("../../header.php");
include("../../databaseConnection.php");




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $announcement_name = $_POST['announcement_name'] ?? '';
    $description = $_POST['description'] ?? '';
    $currentDate = date("Y-m-d");


    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $originalName = $_FILES['image']['name'];
        $unique_image_name = time() . "_" . basename($originalName);
        $destination = '../../uploads/' . $unique_image_name;

        if (move_uploaded_file($fileTmpPath, $destination)) {
            $stmt = $conn->prepare("INSERT INTO announcement (title, description, postdate, image) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $announcement_name, $description, $currentDate, $unique_image_name);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Announcement added successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'File upload failed']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No file uploaded or file error']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
