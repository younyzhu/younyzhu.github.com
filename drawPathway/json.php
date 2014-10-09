<?php
   header("Content-type: application/json");
   $json = $_POST['json'];
   $name = $_POST['name'];
   $file = fopen($name,'w+');
   fwrite($file, $json);
   fclose($file);

   $log = $_POST['log'];
   $logName = $_POST['logName'];
   $file = fopen($logName,'w+');
   fwrite($file, $log);
   fclose($file);

   $dir = getcwd();
   $dir = dirname($dir);  //get Parent directory
   $dir .= "/Jsondata/";  //jsondata
   $dir .= $_POST['str'];
   $file = fopen($dir,'w+');
   fwrite($file, $json);
   fclose($file);

   if ( file_exists($name) && file_exists($logName) )
    {
        echo true;
    }
    else
    {
        echo false;
    }
?>


