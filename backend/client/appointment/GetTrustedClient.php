<?php

include("../../header.php");
include("../../databaseConnection.php");

$status = 0;

$getTrustedClient = $conn->prepare(
    "SELECT profile, fullname FROM users WHERE acc_type = ?"
);
$getTrustedClient->bind_param("i", $status);
$getTrustedClient->execute();

$result = $getTrustedClient->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(['success' => true, 'data' => $data]);
