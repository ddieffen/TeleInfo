<?php
//$gpio_off = shell_exec("sudo gpio write 0 0");
$myfile = fopen("/var/www/html/mode-vac", "w") or die("Unable to open file!");
$txt = "OFF";
fwrite($myfile, $txt);
fclose($myfile);
?>
