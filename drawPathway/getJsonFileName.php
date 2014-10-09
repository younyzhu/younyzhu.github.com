<?php
$files = array();
$dir = getcwd();
$dir = dirname($dir);  //get Parent directory
$dir .= "/Jsondata/*.json";

$files = glob($dir);
usort($files, function($a, $b) {
    return filemtime($b) < filemtime($a);
});
foreach($files as &$value)
{
     $value = substr($value,strrpos($value,'/')+1);
}
    header('Content-type: application/json');
    echo json_encode($files);
?>