<?php

include("../header.php");
include("../databaseConnection.php");

$response = [];

$pending = mysqli_query($conn, "SELECT COUNT(*) as count FROM appointments WHERE status= 0");
$completed = mysqli_query($conn, "SELECT COUNT(*) as count FROM appointments WHERE status= 1");
$followUp = mysqli_query($conn, "SELECT COUNT(*) as count FROM appointments WHERE status = 0 AND is_followup = 1");
$completedFollowUp = mysqli_query($conn, "SELECT COUNT(*) as count FROM appointments WHERE status = 1 AND is_followup = 1");
$meds = mysqli_query($conn, "SELECT COUNT(*) as count FROM shop");
$soonToExpire = mysqli_query($conn, "SELECT COUNT(*) as count FROM shop");
$bestSeller = mysqli_query($conn, "SELECT COUNT(*) as count FROM shop");
$lowstock = mysqli_query($conn, "SELECT COUNT(*) as count FROM shop WHERE stock < 4");
$soonToExpire = mysqli_query($conn, "SELECT COUNT(*) as count FROM shop WHERE expiration_date >= CURDATE() AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
");

$response['appointment'] = [
    'pending' => mysqli_fetch_assoc($pending)['count'],
    'completed' => mysqli_fetch_assoc($completed)['count'],
    'followUp' => mysqli_fetch_assoc($followUp)['count'],
    'completedFollowUp' => mysqli_fetch_assoc($completedFollowUp)['count'],
];

$response['shop'] = [
    'all' => mysqli_fetch_assoc($meds)['count'],
    'soonToExpire' => mysqli_fetch_assoc($soonToExpire)['count'],
    'bestSeller' => mysqli_fetch_assoc($bestSeller)['count'],
    'lowstock' => mysqli_fetch_assoc($lowstock)['count'],
];


echo json_encode($response);
