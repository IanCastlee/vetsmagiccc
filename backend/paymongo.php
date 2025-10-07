<?php
include("./header.php");
include("./databaseConnection.php");

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

header('Content-Type: application/json');

// Decode raw JSON input from request body
$input = json_decode(file_get_contents("php://input"), true);

// Validate required input fields
if (isset($input['amount'], $input['description'], $input['remarks'])) {
    $amount = (int) $input['amount'];
    $description = $input['description'];
    $remarks = $input['remarks'];

    $ch = curl_init();

    // Securely fetch your PayMongo secret key from .env
    $secretKey = $_ENV['PAYMONGO_SECRET_KEY'];
    $encodedSecret = base64_encode($secretKey . ':');

    curl_setopt($ch, CURLOPT_URL, "https://api.paymongo.com/v1/links");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        "Authorization: Basic $encodedSecret",
        'Content-Type: application/json',
    ]);

    $data = [
        "data" => [
            "attributes" => [
                "amount" => $amount,
                "description" => $description,
                "remarks" => $remarks,
                "redirect" => [
                    "success" => "http://localhost:5173/",
                    "failed" => "http://localhost:5173/"
                ],
            ]
        ]
    ];

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => 'Curl error: ' . curl_error($ch)]);
    } else {
        $decodedResponse = json_decode($response, true);
        if (isset($decodedResponse['data']['attributes']['checkout_url'])) {
            echo json_encode(['checkout_url' => $decodedResponse['data']['attributes']['checkout_url']]);
        } else {
            echo json_encode([
                'error' => 'Unable to fetch the checkout URL.',
                'debug' => $decodedResponse
            ]);
        }
    }

    curl_close($ch);
} else {
    echo json_encode(['error' => 'Missing required parameters.']);
}
