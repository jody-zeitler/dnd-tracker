<?php

$name = $_POST['loadName'];
$name = "encounters/".$name.".dnd";

$file = fopen($name, 'r');

$data = fread($file, filesize($name));

fclose($file);

if ($data){
	echo $data;
} else {
	echo "NODATA";
}

?>