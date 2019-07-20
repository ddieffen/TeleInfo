<?php

$sqlite = '/home/dietpi/teleinfo.sqlite';

  //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour les afficher sur le graphique
  //
  function getTempHum ($nb_days) {
    global $sqlite;
    $now  = time();
    $past = strtotime("-$nb_days day", $now);
    $db = new SQLite3($sqlite);
    $results = $db->query("SELECT * FROM home WHERE timestamp > $past ORDER BY timestamp ASC;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){

      $data[] = "{ \"t\": ".$row['timestamp'].
                ", \"t1\": ".$row['t1'].
                ", \"t2\": ".$row['t2'].
                ", \"t3\": ".$row['t3'].
                ", \"h1\": ".$row['h1'].
                ", \"h2\": ".$row['h2'].
                ", \"h3\": ".$row['h3']."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getTempHum(7);

?>
