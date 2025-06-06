




<?php

// $host = "sql307.infinityfree.com";
// $username = "if0_38726600";
// $password = 'gKfcV0pCqkQsL';
// $database = "if0_38726600_vetcare";

// $conn = mysqli_connect($host, $username, $password, $database);

// if(!$conn){
//     die("Connection failed: " . mysqli_connect_error());
// }



$host = "localhost";
$username = "root";
$password = '';
$database = "vetcare";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>