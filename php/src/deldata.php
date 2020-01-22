<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

// $del_id = $_POST["id"];
$data = file_get_contents('php://input');
$data2 = json_decode($data,true);

$del_id = $data2[data][id];



$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_set_charset($conn,"utf8");
$sql = "DELETE FROM Channel WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i',$del_id);
$stmt->execute();
$stmt->close();
echo "OK";

$conn->close();
?>