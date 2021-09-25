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
    if (strlen($y) > $maximum){
        $y = substr($y,0,11);
    }
    if (strlen($r) > $maximum){
        $r = substr($r,0,11);
    }
    if (strlen($rStr) > $maximum){
        $rStr = substr($rStr,0,11);
    }
    if (strlen($yStr) > $maximum){
        $yStr = substr($yStr,0,11);
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


    if ((($x <= $r) && ($x >= 0) && ($y >= 0) && ($y <= $r) && ($x + 2 * $y >= $r)) ||
        (($x <= $r / 2) && ($x >= 0) && ($y <= 0) && ($y >= -$r / 2)
            || (($x <= 0) && ($x >= -$r) && ($y <= 0) && ($y >= -$r / 2))
        )
    ) {
        $out = "<span style='color: lime'>True</span>";
    } else {
        $out = "<span style='color: red'>False</span>";
    }

    $calc_time = microtime(true) - $start;
    $answer = array($xStr, $yStr, $rStr, $out, $now, $calc_time);
    array_push($_SESSION['data'], $answer);
}
?>
<table align="center" class="result_table">
    <tr>
        <th class="variable">X</th>
        <th class="variable">Y</th>
        <th class="variable">R</th>
        <th>Result</th>
        <th>Submit time</th>
        <th>Calculation time</th>
    </tr>
    <?php foreach ($_SESSION['data'] as $word) { ?>
        <tr>
            <td><?php echo $word[0] ?></td>
            <td><?php echo $word[1] ?></td>
            <td><?php echo $word[2] ?></td>
            <td><?php echo $word[3] ?></td>
            <td><?php echo $word[4] ?></td>
            <td><?php echo number_format($word[5], 10, ".", "") . " sec" ?></td>
        </tr>
    <?php } ?>
</table>
