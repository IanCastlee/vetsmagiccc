<?php
include("../../header.php");
include("../../databaseConnection.php");

// Get status from query string, default to 0
$status = isset($_GET['status']) ? intval($_GET['status']) : 0;

$getShop = $conn->prepare("
    SELECT sr.*, u.user_id, u.fullname, s.med_name
    FROM shop_reservation AS sr
    JOIN users AS u ON u.user_id = sr.user_id
    JOIN shop AS s ON s.medicine_id = sr.item_id
    WHERE sr.status = ?
");
$getShop->bind_param('i', $status);
$getShop->execute();
$result = $getShop->get_result();

$medicine = [];
while ($row = $result->fetch_assoc()) {
    $medicine[] = $row;
}

echo json_encode(['success' => true, 'data' => $medicine]);
?>
