<?php

include("../../header.php");
include("../../databaseConnection.php");

$query = "SELECT med_name, orig_stock, price, capital, (orig_stock - stock) AS sold 
          FROM shop 
          WHERE orig_stock > stock 
          ORDER BY sold DESC";

$result = mysqli_query($conn, $query);

$data = [];
$totalCapital = 0;
$currentSale = 0;

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $sold = (int)$row['sold'];
        $price = (float)$row['price'];
        $capital = (float)$row['capital'];
        $profit = ($sold * $price) - ($sold * $capital);


        $sale =  (int)$row['orig_stock'] - $sold;
        $origSale =  $sale * $price;

        $totalCapital += $capital;
        $currentSale += $origSale;

        $data[] = [
            'name' => $row['med_name'],
            'sold' => $sold,
            'orig_stock' => (int)$row['orig_stock'],
            'capital' => $capital,
            'profit' => $profit,
            'price' => $price
        ];
    }
}

echo json_encode([
    'data' => $data,
    'totalCapital' => $totalCapital,
    'currentSale' => $currentSale
]);
