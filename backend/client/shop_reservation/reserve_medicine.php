<?php
include("../../header.php");
include("../../databaseConnection.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    isset($data["item_id"]) &&
    isset($data["user_id"]) &&
    isset($data["price"]) &&
    isset($data["qty"])
) {
    $item_id = intval($data["item_id"]);
    $user_id = intval($data["user_id"]);
    $price = floatval($data["price"]);
    $qty = intval($data["qty"]);
    $note = isset($data["note"]) ? trim($data["note"]) : "";
    $status = 0; // pending reservation

    // check stock
    $checkStock = $conn->prepare("SELECT stock FROM shop WHERE medicine_id = ?");
    $checkStock->bind_param("i", $item_id);
    $checkStock->execute();
    $result = $checkStock->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Item not found."]);
        exit;
    }

    $row = $result->fetch_assoc();
    $currentStock = intval($row["stock"]);

    if ($qty > $currentStock) {
        echo json_encode(["success" => false, "message" => "Not enough stock available."]);
        exit;
    }

    $conn->begin_transaction();

    try {
        $insert = $conn->prepare("
            INSERT INTO shop_reservation (item_id, user_id, price, qty, note, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $insert->bind_param("iidisi", $item_id, $user_id, $price, $qty, $note, $status);
        $insert->execute();

        $newStock = $currentStock - $qty;
        $update = $conn->prepare("UPDATE shop SET stock = ? WHERE medicine_id = ?");
        $update->bind_param("ii", $newStock, $item_id);
        $update->execute();

        $conn->commit();

        echo json_encode(["success" => true, "message" => "Reservation saved successfully."]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Error saving reservation.", "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields."]);
}
?>
