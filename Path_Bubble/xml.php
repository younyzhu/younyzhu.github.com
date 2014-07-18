<?php
   header("Content-type: application/xml");
   $xml = $_POST['xml'];
   $name = $_POST['name'];
   $file = fopen($name,'w+');
   fwrite($file, $xml);
   fclose($file);

   $log = $_POST['log'];
   $logName = $_POST['logName'];
   $file = fopen($logName,'w+');
   fwrite($file, $log);
   fclose($file);
?>