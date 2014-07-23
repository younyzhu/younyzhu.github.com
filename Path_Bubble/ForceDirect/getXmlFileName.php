<?php

$files = array();
$dir = getcwd();
$dir = dirname($dir);  //get Parent directory
$dir .= "/pathwayGraphXml";
// Open a directory, and read its contents
if (is_dir($dir)){
  if ($dh = opendir($dir)){
    while (($file = readdir($dh)) !== false){
      if ($file == '.' || $file == '..') {
        continue;
    }
    $files[] = $file;

    }
    closedir($dh);
  }
}
    header('Content-type: application/json');
    echo json_encode($files);
?>