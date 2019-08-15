<?php

$sqlite = '/home/dietpi/teleinfo.sqlite';

 //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour les afficher sur le gra$
  //
  function getHPHCSharesByWeek () {
    global $sqlite;
    $db = new SQLite3($sqlite);
    $results = $db->query("select strftime('%Y-%W', datetime(timestamp, 'unixepoch', 'localtime')) as week, 100*sum(daily_hc)/(sum(daily_hc)+sum(daily_hp)) as shareHC, 100*sum(daily_hp)/(sum(daily_hc)+sum(daily_hp)) as shareHP from conso group by week;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $data[] = "{ \"w\": \"".$row['week']."\", \"shareHC\": "
                .$row['shareHC'].", \"shareHP\": ".$row['shareHP']."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getHPHCSharesByWeek();

?>
