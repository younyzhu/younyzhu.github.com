<?php
   header("Content-type: application/json");
   $file_x ="./tmpData/";
   $file_x .= $_POST['name'];
    if (file_exists($file_x))
    {
        unlink($file_x); // delete it here only if it exists
        echo "The file has been deleted";
    }
    else
    {
        echo "The file was not found and could not be deleted";
    }
?>


