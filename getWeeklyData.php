$query = "SELECT strftime('%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, sum(daily_hc), sum(daily_hp) FROM conso GROUP BY week;"

//changer les -1 en 0 pour ne pas se fatiguer sur les reguetes sql ?
//et modifier les define des courbes en JS
//$query = " SELECT strftime('%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(text), sum(sunext) FROM weather GROUP BY week;"


//uniquement la temp puis calculer uniquement l'energie solaire
$query = "SELECT strftime('%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(text) FROM weather WHERE text <> -1 GROUP BY week;"

$query = "SELECT strftime('%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, sum(sunext) FROM weather WHERE sunext <> -1 GROUP BY week;"
