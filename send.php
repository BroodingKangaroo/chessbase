<?php

if(isset($_GET['code'])){

$host = 'localhost';
$db_name = 'f0297453_loginsbase';
$user_name = 'f0297453_f0297453';
$user_password = 'antainbeec';

$connect = mysqli_connect($host, $user_name, $user_password, $db_name);
mysqli_set_charset($connect, "utf8");


$code = $_GET['code'];

$sql = mysqli_query($connect, "INSERT INTO `list` (`id`, `id_u`, `code`) VALUES (NULL, '1', '$code');");
    
    
}

    
?>