<?php

include("../../header.php");
include("../../databaseConnection.php");

if (isset($_POST['fullname'], $_POST['specialization'], $_POST['age'], $_POST['gender'], $_POST['time'], $_POST['duration'], $_POST['experience'], $_POST['certificate'], $_POST['address'], $_POST['phone'], $_POST['about'], $_POST['email'], $_POST['password']) && isset($_FILES['profile'])) {

    $fullname = $_POST['fullname'];
    $specialization = $_POST['specialization'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $time = $_POST['time'];
    $duration = $_POST['duration'];
    $experience = $_POST['experience'];
    $certificate = $_POST['certificate'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];
    $about = $_POST['about'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $accType = 1;
    $status = 1;

    // Handle file upload
    $profile_name = $_FILES['profile']['name'];
    $unique_profile_name = time() . "_" . basename($profile_name);
    $profile_tmp = $_FILES['profile']['tmp_name'];
    $profile_folder = "../../uploads/" . time() . "_" . basename($profile_name);

    if (move_uploaded_file($profile_tmp, $profile_folder)) {

        $check_email = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $check_email->bind_param("s", $email);
        $check_email->execute();
        $result = $check_email->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => "Email already exists"]);
        } else {
            $insert_user = $conn->prepare("INSERT INTO users (fullname, address, phone, profile, email, password, acc_type, status) VALUES (?,?,?,?,?,?,?,?)");
            $insert_user->bind_param("ssssssii", $fullname, $address, $phone, $unique_profile_name,  $email, $password, $accType, $status);
            if ($insert_user->execute()) {

                $user_id = $conn->insert_id;
                $insert_veterinarian_info = $conn->prepare("INSERT INTO veterinarian_info (user_id, specialization, age, gender, time, duration, experience, certification, about) VALUES (?,?,?,?,?,?,?,?,?)");
                $insert_veterinarian_info->bind_param("isississs", $user_id, $specialization, $age, $gender, $time, $duration, $experience, $certificate, $about);

                if ($insert_veterinarian_info->execute()) {
                    echo json_encode(['success' => true, 'message' => "New Veterinarian Added"]);
                } else {
                    echo json_encode(['success' => false, 'message' => "Veterinarian Info Insert Failed"]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => "User Insert Failed"]);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => "File upload failed!"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
