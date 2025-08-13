<?php

include("../../header.php");
include("../../databaseConnection.php");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $specialization = $_POST['specialization'] ?? '';
    $category = $_POST['category'] ?? '';
    $med_name = $_POST['med_name'] ?? '';
    $stock = $_POST['stock'] ?? 0;
    $price = $_POST['price'] ?? '';
    $dosage = $_POST['dosage'] ?? '';
    $description = $_POST['description'] ?? '';
    $expdate = $_POST['expdate'] ?? '';
    $capital = $_POST['capital'] ?? '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $originalName = $_FILES['image']['name'];
        $unique_image_name = time() . "_" . basename($originalName);
        $destination = '../../uploads/' . $unique_image_name;

        if (move_uploaded_file($fileTmpPath, $destination)) {
            $stmt = $conn->prepare("INSERT INTO shop (specialization, category, med_name,orig_stock, stock, price, dosage, description, expiration_date, capital, med_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssiissssss", $specialization, $category, $med_name, $stock, $stock, $price, $dosage, $description, $expdate, $capital, $unique_image_name);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Medicine added successfully']);
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
