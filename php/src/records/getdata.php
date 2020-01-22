<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_query($conn, "set names 'utf8'");
 
$sql = "select t2.description 'product',t3.description 'channel',t1.date,t1.count from 
(SELECT t1.channelName,t1.productName,date(t1.dt) 'date',count(*) 'count' FROM `Records` t1 inner join Product t2 on t1.productName = t2.name
where t1.firstPay >= t2.minFirstPay
and t1.state = 6
and t1.dt > ?
Group by t1.channelName,t1.productName,date(t1.dt)) t1
inner join Product t2
on t1.productName = t2.name
left join Channel t3
on t1.channelName =t3.name";

$stmt = $conn->prepare($sql);
$stmt->bind_param('s',$st);

$st = date("Y-m-d 00:00:00", strtotime("-3 day"));
$stmt->execute();

$stmt->bind_result($product, $channel, $date, $count);
$stmt->store_result();
$rows = array();
$i = 0;
while ($stmt->fetch()) {
    $rows[$i]['product'] = $product;
    $rows[$i]['channel'] = $channel;
    $rows[$i]['date'] = $date;
    $rows[$i]['count'] = $count;
    $i++;
}
$stmt->free_result();
echo json_encode($rows);

$stmt->close();
$conn->close();
?>