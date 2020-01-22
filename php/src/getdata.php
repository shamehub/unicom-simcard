<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

// $servername = "101.201.148.97:3306";
$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

// $conn = new mysqli($servername, $username, $password, $dbname);
$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
 
$sql = "SELECT * FROM Channel";
mysqli_query($conn, "set names 'utf8'");
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) $res[] = $row;
    echo json_encode($res);
} else {
    echo "err";
}

$conn->close();
?>