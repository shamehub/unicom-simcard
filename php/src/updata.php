<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header('Access-Control-Allow-Headers:x-requested-with,content-type');

$data = file_get_contents('php://input');
// $data = $_POST("data");
// $data2 = json_decode($data,true);

// $updata_name = (string)$data2['data']['name'];
// $updata_description = (string)$data2['data']['description'];
// $updata_status = (int)$data2['data']['status'];
// $updata_id = (int)$data2['data']['id'];
$data2 = json_decode($data);

$updata_name = $data2->data->name;
$updata_description = $data2->data->description;
$updata_status = $data2->data->status;
$updata_id = $data2->data->id;

$servername = "101.201.148.97";
$username = "card_user";
$password = "card(2015)!@#";
$dbname = "simcard";

// $updata_name2 = "测试0808";
// $updata_description2 = "渠道0808";
// $updata_status2 = 0;
// $updata_id2 = 21;

// $type1 = gettype($updata_name);
// $type2 = gettype($updata_name2);
// echo 'type1:' . $type1 . ' type2:' . $type2;

// print_r($data2);
echo '<br>' .$updata_name . '<br>' . $updata_description . '<br>' .$updata_status . '<br>' .$updata_id. '<br>';

$conn = mysqli_connect($servername, $username, $password, $dbname, 3306);
mysqli_set_charset($conn,"utf8");
$sql = "UPDATE Channel SET name=?, description=?, status=? WHERE id=?;";

$stmt = $conn->prepare($sql);
$para = array($update_name,$update_description,$update_status,$updata_id);
call_user_func_array(array($stmt, 'bind_param'), $array);
$stmt->execute();
echo $stmt->affected_rows . '<br>';
$stmt->close();


echo "OK";

$conn->close();
?>