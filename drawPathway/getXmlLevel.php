
<?php
$files = array();
$dir = getcwd();
//$dir = dirname($dir);  //get Parent directory
$dir .= "/ReactomHierarchyData/Level5/*.xml";

$files = glob($dir);
usort($files, function($a, $b) {
    return filemtime($b) < filemtime($a);
});
foreach($files as &$value)
{
     $value = substr($value,strrpos($value,'/')+1);
}
    Header('Content-Type: application/json; charset=UTF8');
    echo json_encode($files);
?>