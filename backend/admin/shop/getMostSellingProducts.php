<?php

include("../../header.php");
include("../../databaseConnection.php");

// Get products that have been sold (i.e., orig_stock > stock)
$query = "SELECT med_name, (orig_stock - stock) AS sold 
          FROM shop 
          WHERE orig_stock > stock 
          ORDER BY sold DESC 
          LIMIT 10";

$result = mysqli_query($conn, $query);

$data = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = [
            'name' => $row['med_name'],
            'sold' => (int)$row['sold']
        ];
    }
}

echo json_encode($data);
