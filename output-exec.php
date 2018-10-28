<?php

// Lit un fichier, et le place dans une chaîne
$filename = "/var/www/html/mode-vac";
$handle = fopen($filename, "r");
$modevac = fread($handle, filesize($filename));
fclose($handle);

// Lit un fichier, et le place dans une chaîne
$filename = "/var/www/html/heat-salon";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
fclose($handle);

if($contents == "ON" && $modevac == "OFF"){
  $gpio_off = shell_exec("sudo gpio write 0 1");
  echo("checked=checked");
}
else{
  $gpio_off = shell_exec("sudo gpio write 0 0");
  echo("");
}

// Lit un fichier, et le place dans une chaîne
$filename = "/var/www/html/heat-chambres";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
fclose($handle);

if($contents == "ON" && $modevac == "OFF"){
  $gpio_off = shell_exec("sudo gpio write 2 1");
  echo("checked=checked");
}
else{
  $gpio_off = shell_exec("sudo gpio write 2 0");
  echo("");
}

// Lit un fichier, et le place dans une chaîne
$filename = "/var/www/html/heat-autres";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
fclose($handle);

if($contents == "ON" && $modevac == "OFF"){
  $gpio_off = shell_exec("sudo gpio write 3 1");
  echo("checked=checked");
}
else{
  $gpio_off = shell_exec("sudo gpio write 3 0");
  echo("");
}

?>
