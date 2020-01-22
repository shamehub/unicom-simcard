<?php

$s_channel = $_POST["channel"];
$s_product = $_POST["product"];
$s_start_date = $_POST["startDate"];
$s_end_date = $_POST["endDate"];
$s_method = $_POST["method"];

$t = true;
$f = false;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_query($conn, "set names 'utf8'");

$sql_day = "select t2.description 'product',t3.description 'channel',t1.date,t1.count from 
(SELECT t1.channelName,t1.productName,date(t1.dt) 'date',count(*) 'count' FROM `Records` t1 inner join Product t2 on t1.productName = t2.name
where t1.firstPay >= t2.minFirstPay
and t1.state = 6
and t1.dt between ? and ?
and FIND_IN_SET ( t1.channelName, ? )
and FIND_IN_SET ( t1.productName, ? )
Group by t1.channelName,t1.productName,date(t1.dt)) t1
inner join Product t2
on t1.productName = t2.name
left join Channel t3
on t1.channelName =t3.name";

$sql_total = "select t2.description 'product',t3.description 'channel',t1.count from 
(SELECT t1.channelName,t1.productName,count(*) 'count' FROM `Records` t1 inner join Product t2 on t1.productName = t2.name
where t1.firstPay >= t2.minFirstPay
and t1.state = 6
and t1.dt between ? and ?
and FIND_IN_SET ( t1.channelName, ? )
and FIND_IN_SET ( t1.productName, ? )
Group by t1.channelName,t1.productName) t1
inner join Product t2
on t1.productName = t2.name
left join Channel t3
on t1.channelName =t3.name";

$sql = "";

if ($s_method == "day") {
  $sql = $sql_day;
} elseif ($s_method == "total") {
  $sql = $sql_total;
} else {
  echo $s_method;
}

$stmt = $conn->prepare($sql);
$stmt->bind_param('ssss',$s_start_date,$s_end_date,$s_channel,$s_product);

$stmt->execute();

if ($s_method == "day") {
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
} else {
  $stmt->bind_result($product, $channel, $count);
  $stmt->store_result();
  $rows = array();
  $i = 0;
  while ($stmt->fetch()) {
      $rows[$i]['product'] = $product;
      $rows[$i]['channel'] = $channel;
      $rows[$i]['count'] = $count;
      $i++;
  }
  $stmt->free_result();
  echo json_encode($rows);
}


$stmt->close();
$conn->close();
?>