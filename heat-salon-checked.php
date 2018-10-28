<?php

// Lit un fichier, et le place dans une chaîne
$filename = "/var/www/html/heat-salon";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
fclose($handle);

if($contents == "ON"){
  echo("checked=checked");
}
else{
  echo("");
}

?>
