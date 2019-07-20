<?php

$sqlite = '/home/dietpi/teleinfo.sqlite';

 //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour les afficher sur le graphique
  //
  function getInstantConsumption ($nb_days) {
    global $sqlite;
    $now  = time();
    $past = strtotime("-$nb_days day", $now);
    $db = new SQLite3($sqlite);
    $results = $db->query("SELECT * FROM weather WHERE timestamp > $past ORDER BY timestamp ASC;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $data[] = "{ \"t\": ".$row['timestamp'].
                ", \"tmp\": ".$row['text'].
                ", \"sun\": ".$row['sunext'].
                ", \"hum\": ".$row['hext']."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getInstantConsumption(7);

?>
