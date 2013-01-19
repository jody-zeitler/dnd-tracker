<?php

$name = $_POST['saveName'];
$name = "encounters/".$name.".dnd";
$data = $_POST['saveData'];
$overwrite = $_POST['overwrite'];

if ($overwrite == null and file_exists($name)) {
	echo "FILEEXISTS";
} else {
	$file = fopen($name, 'w');
	fwrite($file, json_encode($data));
	fclose($file);
	echo "OK";
}

?>