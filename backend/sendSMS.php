<?php
include("./header.php");

require __DIR__ . '/vendor/autoload.php'; // Adjust the path

use Twilio\Rest\Client;

header("Content-Type: application/json");

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$recipient = $data['to'];
$message = $data['message'];

$account_sid = 'AC85f8794199bcf4557e55fb82f2244be2';
$auth_token = '9df30ddad952de9db1d9f6ad94ace201';
$twilio_number = '+16064056810';

try {
    $client = new Client($account_sid, $auth_token);
    $client->messages->create(
        $recipient,
        [
            'from' => $twilio_number,
            'body' => $message
        ]
    );
    echo json_encode(["success" => true, "message" => "SMS sent"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
