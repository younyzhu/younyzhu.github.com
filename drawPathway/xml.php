<?php
   header("Content-type: application/xml");
   $dir = getcwd();

   $xml = $_POST['xml'];
   $name = $_POST['name'];
   $data = $dir. "/data/" . $name;
   $file1 = fopen($data,'w+');
   fwrite($file1, $xml);
   fclose($file1);

   $log = $_POST['log'];
   $logName = $_POST['logName'];
   $logData = $dir. "/logData/" . $logName;
   $file2 = fopen($logData,'w+');
   fwrite($file2, $log);
   fclose($file2);
/*
   $dir = dirname($dir);  //get Parent directory
   $dir .= "/XMLdata/";  //jsondata
   $dir .= $_POST['str'];
   $file3 = fopen($dir,'w+');
   fwrite($file3, $xml);
   fclose($file3);
*/
   $changeLog = $_POST['changeLog'];
   $logName1 = $_POST['logName'];
   $logData1 = $dir. "/changeData/" . $logName1;
   $file4 = fopen($logData1,'w+');
   fwrite($file4, $changeLog);
   fclose($file4);

    if (file_exists($data) && file_exists($logData) )
    {
        echo true;
    }
    else
    {
        echo false;
    }
?>