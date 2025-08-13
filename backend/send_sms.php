<?php
include("./header.php");
include("./databaseConnection.php");

require_once __DIR__ . '/vendor/autoload.php';

use ClickSend\Api\SMSApi;
use ClickSend\Configuration;
use ClickSend\Model\SmsMessage;
use ClickSend\Model\SmsMessageCollection;

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$phone = $data['phone'];
$message = $data['message'];

$config = Configuration::getDefaultConfiguration()
    ->setUsername('ml99997955@gmail.com')
    ->setPassword('63960B66-617B-D559-B739-891A8A41BD8A');

$apiInstance = new SMSApi(null, $config);

$msg = new SmsMessage([
    'source' => 'php',
    'from' => 'VETCARE',
    'body' => $message,
    'to' => $phone,
    'schedule' => null
]);

$msgCollection = new SmsMessageCollection(['messages' => [$msg]]);

try {
    $result = $apiInstance->smsSendPost($msgCollection);
    echo json_encode(['success' => true, 'response' => $result]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
