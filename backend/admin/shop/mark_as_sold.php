<?php
include("../../header.php");
include("../../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["id"])) {
    $id = intval($data["id"]);

    $update = $conn->prepare("UPDATE shop_reservation SET status = 1 WHERE id = ?");
    $update->bind_param("i", $id);

    if ($update->execute()) {
        echo json_encode(["success" => true, "message" => "Marked as sold"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
}
?>
