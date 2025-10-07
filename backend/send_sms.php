<?php
// Include reusable components
include("./header.php");
include("./databaseConnection.php");

// Load Composer's autoload
require_once __DIR__ . '/vendor/autoload.php';

// Load .env file
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use ClickSend\Api\SMSApi;
use ClickSend\Configuration;
use ClickSend\Model\SmsMessage;
use ClickSend\Model\SmsMessageCollection;

// Set response type
header('Content-Type: application/json');

// Decode incoming JSON
$data = json_decode(file_get_contents('php://input'), true);
$phone = $data['phone'] ?? null;
$message = $data['message'] ?? null;

// Validate input
if (!$phone || !$message) {
    echo json_encode(['success' => false, 'error' => 'Phone number or message is missing.']);
    exit;
}

// Configure ClickSend using credentials from .env
$config = Configuration::getDefaultConfiguration()
    ->setUsername($_ENV['CLICKSEND_USERNAME'])
    ->setPassword($_ENV['CLICKSEND_API_KEY']);

// Prepare SMS
$msg = new SmsMessage([
    'source' => 'php',
    'from' => 'VETSMAGIC', 
    'body' => $message,
    'to' => $phone,
    'schedule' => null
]);

$msgCollection = new SmsMessageCollection(['messages' => [$msg]]);

// Send the message
try {
    $apiInstance = new SMSApi(null, $config);
    $result = $apiInstance->smsSendPost($msgCollection);
    echo json_encode(['success' => true, 'response' => $result]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
