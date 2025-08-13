<?php

include("../../header.php");
include("../../databaseConnection.php");

if (
    isset($_POST['user_id'], $_POST['fullname'], $_POST['specialization'], $_POST['age'], $_POST['gender'], $_POST['time'], $_POST['duration'], $_POST['experience'], $_POST['certificate'], $_POST['address'], $_POST['phone'], $_POST['about'], $_POST['email'])
) {
    $user_id = $_POST['user_id'];
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

    $update_profile = false;
    $profile_name = "";

    // Handle optional file upload
    if (isset($_FILES['profile']) && $_FILES['profile']['error'] === 0) {
        $profile_name = $_FILES['profile']['name'];
        $unique_profile_name = time() . "_" . basename($profile_name);
        $profile_tmp = $_FILES['profile']['tmp_name'];
        $profile_folder = "../../uploads/" . $unique_profile_name;

        if (move_uploaded_file($profile_tmp, $profile_folder)) {
            $update_profile = true;
        } else {
            echo json_encode(['success' => false, 'message' => "File upload failed!"]);
            exit;
        }
    }

    // Check if user exists
    $check_user = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
    $check_user->bind_param("i", $user_id);
    $check_user->execute();
    $user_result = $check_user->get_result();

    if ($user_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => "User not found"]);
        exit;
    }

    // Update user table
    if ($update_profile) {
        $update_user = $conn->prepare("UPDATE users SET fullname=?, address=?, phone=?, profile=?, email=? WHERE user_id=?");
        $update_user->bind_param("sssssi", $fullname, $address, $phone, $unique_profile_name, $email, $user_id);
    } else {
        $update_user = $conn->prepare("UPDATE users SET fullname=?, address=?, phone=?, email=? WHERE user_id=?");
        $update_user->bind_param("ssssi", $fullname, $address, $phone, $email, $user_id);
    }

    if ($update_user->execute()) {
        // Update veterinarian_info table
        $update_info = $conn->prepare("UPDATE vetinfo SET specialization=?, age=?, gender=?, time=?, duration=?, experience=?, certification=?, about=? WHERE user_id=?");
        $update_info->bind_param("sississsi", $specialization, $age, $gender, $time, $duration, $experience, $certificate, $about, $user_id);

        if ($update_info->execute()) {
            echo json_encode(['success' => true, 'message' => "Veterinarian Info Updated"]);
        } else {
            echo json_encode(['success' => false, 'message' => "Failed to update veterinarian info"]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => "Failed to update user info"]);
    }
} else {
    echo json_encode(['success' => false, 'message' => "Invalid Input"]);
}
