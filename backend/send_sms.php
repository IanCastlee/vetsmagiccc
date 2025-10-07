<?php
include("./header.php");
include("./databaseConnection.php");

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use ClickSend\Api\SMSApi;
use ClickSend\Configuration;
use ClickSend\Model\SmsMessage;
use ClickSend\Model\SmsMessageCollection;

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$phone = $data['phone'] ?? null;
$message = $data['message'] ?? null;

if (!$phone || !$message) {
    echo json_encode(['success' => false, 'error' => 'Phone number or message is missing.']);
    exit;
}

$config = Configuration::getDefaultConfiguration()
    ->setUsername($_ENV['CLICKSEND_USERNAME'])
    ->setPassword($_ENV['CLICKSEND_API_KEY']);

// Initialize SMS API
$apiInstance = new SMSApi(null, $config);

// Create SMS message
$msg = new SmsMessage([
    'source' => 'php',
    'from' => 'VETCARE',
    'body' => $message,
    'to' => $phone,
    'schedule' => null
]);

$msgCollection = new SmsMessageCollection(['messages' => [$msg]]);

// Try sending SMS
try {
    $result = $apiInstance->smsSendPost($msgCollection);
    echo json_encode(['success' => true, 'response' => $result]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
