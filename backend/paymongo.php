<?php
include("./header.php");
include("./databaseConnection.php");

header('Content-Type: application/json');

// Decode raw JSON input from request body
$input = json_decode(file_get_contents("php://input"), true);

if (isset($input['amount']) && isset($input['description']) && isset($input['remarks'])) {
    $amount = $input['amount'];
    $description = $input['description'];
    $remarks = $input['remarks'];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.paymongo.com/v1/links");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Authorization: Basic c2tfdGVzdF9aWnFMSkNRb2M0WjNjQlRSdGVBUFhhcjk6',
        'Content-Type: application/json',
    ]);

    $data = [
        "data" => [
            "attributes" => [
                "amount" => (int)$amount,
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
