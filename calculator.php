<?php
session_start();
date_default_timezone_set('Europe/Moscow');
$start = microtime(true);
$isValid = true;
$xStr = $_REQUEST['x'];
$yStr = $_REQUEST['y'];
$rStr = $_REQUEST['r'];
$x = $xStr;
$y = $yStr;
$r = $rStr;
//print_r($_REQUEST);
$out = "";
$now = date("H:i:s");
$response = "";
$maximum = 12;
if (!isset($_SESSION['data'])) {
    $_SESSION['data'] = array();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!is_numeric($x) || !is_numeric($y) || !is_numeric($r))
        $isValid = false;
//    if (strlen($y) > $maximum || strlen($x) > $maximum || strlen($r) > $maximum)
//        $isValid = false;
    if (strlen($y) > $maximum) {
        $y = substr($y, 0, 11);
    }
    if (strlen($r) > $maximum) {
        $r = substr($r, 0, 11);
    }
    if (strlen($rStr) > $maximum) {
        $rStr = substr($rStr, 0, 11);
    }
    if (strlen($yStr) > $maximum) {
        $yStr = substr($yStr, 0, 11);
    }
    if ($x < -5 || $x > 3)
        $isValid = false;
    if ($y < -5 || $y > 3)
        $isValid = false;
    if ($r < 2 || $r > 5)
        $isValid = false;
    if (!$isValid) {
        header("Status: 400 Bad Request", true, 400);
        exit;
    }

    if ((($y >= 0) && ($x >= 0) && ((pow($x, 2) + (pow($y, 2))) <= pow($r, 2))) ||
        (($y <= 0) && ($x >= 0) && ($y >= (-$r / 2 + $x))) || (($y <= 0) && ($x <= 0) && ($x >= $r) && ($y >= -$r / 2))) {
        $out = "True";
    } else {
        $out = "False";
    }

    $calc_time = microtime(true) - $start;
    $answer = array($xStr, $yStr, $rStr, $out, $now, number_format($calc_time, 10, ".", "") . " sec");
    array_push($_SESSION['data'], $answer);
}
$result_json = "";
foreach ($_SESSION['data'] as $resp) {
    $jsonData = '{' .
        "\"xval\":\"$resp[0]\"," .
        "\"yval\":\"$resp[1]\"," .
        "\"rval\":\"$resp[2]\"," .
        "\"out\": \"$resp[3]\"," .
        "\"submitTime\":\"$resp[4]\"," .
        "\"calculationTime\":\"$resp[5]\"" .
        "}";
    $result_json = $result_json . $jsonData . ',';
}
$result_json = substr($result_json, 0, -1);
echo '{' . "\"response\":[" . $result_json . ']}';
?>