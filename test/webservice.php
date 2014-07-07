<?php
require_once('nusoap.php');
$server = new soap_server;
$server->register('hello');
$server->register('retrieveByType');
function hello($name) {
    return 'Hello, ' . $name;
}

function retrieveByType($type) {
	if ($type == 'trolling') {
		$arr[0] = 'Donzai Deep Swimmer 5 1/4 inch';
		$arr[1] = 'Yosubi Squid-like 4 inch';
		$arr[2] = 'Fortunata Imperial High Action';
	} else if ($type == 'casting') {
		$arr[0] = 'Silver Spring Mirrors Size 00';
		$arr[1] = 'Gold Spring Mirrors Size 0';
		$arr[2] = 'Mini Minnow Blue';
	} else {
		$arr[0] = 'None found!';
	}

	return $arr;
}

$HTTP_RAW_POST_DATA = isset($HTTP_RAW_POST_DATA) ? $HTTP_RAW_POST_DATA : '';
$server->service($HTTP_RAW_POST_DATA);
?>