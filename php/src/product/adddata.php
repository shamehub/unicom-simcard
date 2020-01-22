<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$data = file_get_contents('php://input');
$data2 = json_decode($data,true);

$add_name = $data2[data][name];
$add_description = $data2[data][description];
$add_url = $data2[data][url];
$add_minFirstPay = $data2[data][minFirstPay];
$add_status = $data2[data][status];

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_set_charset($conn,"utf8");
$sql = "INSERT INTO Product (name, description, url, minFirstPay, status )
  VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param('sssdi',$add_name, $add_description, $add_url, $add_minFirstPay, $add_status);
$stmt->execute();
$stmt->close();
echo "OK";

$conn->close();
?>