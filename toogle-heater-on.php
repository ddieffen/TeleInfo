<?php
//$gpio_off = shell_exec("sudo gpio write 0 1");
$myfile = fopen("heat", "w") or die("Unable to open file!");
$txt = "ON";
fwrite($myfile, $txt);
fclose($myfile);
?>
