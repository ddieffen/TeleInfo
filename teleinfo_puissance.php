#!/usr/bin/php5
<?php

header('Content-type: text/html; charset=utf-8');

require_once('/var/www/html/teleinfo_func.php');

handlePuissance();
echo getLatestVA();
?>
