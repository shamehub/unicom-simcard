<?php

$s_channel = $_POST["channel"];
$s_product = $_POST["product"];
$s_start_date = $_POST["startDate"];
$s_end_date = $_POST["endDate"];

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

// echo "channel:".$s_channel."product:".$s_product."st:".$s_start_date."et:".$s_end_date;

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_query($conn, "set names 'utf8'");

if ($s_start_date) {
    $sql = "SELECT *
    FROM Records
    WHERE channelName = ?
    AND productName = ?
    AND dt >= ?
    AND dt < ? ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssss',$s_channel,$s_product,$s_start_date,$s_end_date);
} else {
    $sql = "SELECT *
    FROM Records
    WHERE channelName = ?
    AND productName = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss',$s_channel,$s_product);
}

$stmt->execute();

$stmt->bind_result($orderId, $openId, $state, $fristPay, $msgId, $mobile, $ctime, $channelName, $productName, $oid, $dt);
$stmt->store_result();
$rows = array();
$i = 0;
while ($stmt->fetch()) {
    $rows[$i]['orderId'] = $orderId;
    $rows[$i]['openId'] = $openId;
    $rows[$i]['state'] = $state;
    $rows[$i]['fristPay'] = $fristPay;
    $rows[$i]['msgId'] = $msgId;
    $rows[$i]['mobile'] = $mobile;
    $rows[$i]['ctime'] = $ctime;
    $rows[$i]['channelName'] = $channelName;
    $rows[$i]['productName'] = $productName;
    $rows[$i]['oid'] = $oid;
    $rows[$i]['dt'] = $dt;
    $i++;
}
$stmt->free_result();
echo json_encode($rows);

$stmt->close();
$conn->close();
?>