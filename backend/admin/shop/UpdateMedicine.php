<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_POST['medicine_id'], $_POST['specialization'], $_POST['category'], $_POST['med_name'], $_POST['stock'], $_POST['price'], $_POST['expdate'], $_POST['dosage'], $_POST['description'], $_POST['capital'], $_POST['expdate'])) {


    $medicine_id = $_POST['medicine_id'];
    $specialization = $_POST['specialization'];
    $category = $_POST['category'];
    $med_name = $_POST['med_name'];
    $stock = $_POST['stock'];
    $price = $_POST['price'];
    $expdate = $_POST['expdate'];
    $dosage = $_POST['dosage'];
    $capital = $_POST['capital'];
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
        $update_medicine = $conn->prepare("UPDATE shop SET specialization = ?, category = ?, med_name = ?, stock = ?, price = ?, dosage = ?, description = ?, capital = ?, expiration_date = ?, med_image = ? WHERE medicine_id = ?");

        $update_medicine->bind_param("ssssssssdsi",  $specialization,  $category, $med_name, $stock, $price, $dosage, $description, $capital, $expdate, $unique_image_name, $medicine_id);
    } else {
        $update_medicine = $conn->prepare("UPDATE shop SET specialization = ?, category = ?, med_name = ?, stock = ?, price = ?, dosage = ?, description = ?,capital = ?, expiration_date=? WHERE medicine_id = ?");
        $update_medicine->bind_param("sssssssdsi",  $specialization,  $category, $med_name, $stock, $price, $dosage, $description, $capital, $expdate, $medicine_id);
    }

    if ($update_medicine->execute()) {
        echo json_encode(['success' => true, 'message' => "Medicine Updated"]);
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update Medicine info"]);
    }
} else {
    echo json_encode(['success' => true, 'message' => "Cant get data from frontend"]);
}
