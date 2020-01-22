<?php

$update_name = $_POST["name"];
$update_description = $_POST["description"];
$updata_url = $_POST["url"];
$updata_minFirstPay = $_POST["minFirstPay"];
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
$sql = "UPDATE Product SET name=?, description=?, url=?, minFirstPay=?, status=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sssdii',$update_name,$update_description,$updata_url,$updata_minFirstPay,$update_status,$post_id);
$stmt->execute();
echo "OK";

$conn->close();
?>