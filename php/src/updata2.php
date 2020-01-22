<?php

$update_name = $_POST["name"];
$update_description = $_POST["description"];
$update_status = $_POST["status"];
$post_id = $_POST["id"];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_set_charset($conn,"utf8");
$sql = "UPDATE Channel SET name=?, description=?, status=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssii',$update_name,$update_description,$update_status,$post_id);
$stmt->execute();
echo "OK";

$conn->close();
?>