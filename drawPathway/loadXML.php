<?php
$files = array();
$dir = getcwd();
$dir = dirname($dir);  //get Parent directory
$dir .= "/XMLdata";  //jsondata
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
    json_encode($files);
    $fileLength = count($files);
    $index = rand(0, $fileLength);

?>