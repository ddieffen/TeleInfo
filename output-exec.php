<?php

// Lit un fichier, et le place dans une chaîne
$filename = "heat";
$handle = fopen($filename, "r");
$contents = fread($handle, filesize($filename));
fclose($handle);

if($contents == "ON"){
  $gpio_off = shell_exec("sudo gpio write 0 0");
  echo($gpio_off." ON");
}
else{
  $gpio_off = shell_exec("sudo gpio write 0 1");
  echo($gpio_off."OFF");
}

?>
