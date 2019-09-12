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
    $results = $db->query("SELECT timestamp,t1,t2,t3,t4,t5,h1,h2,h3,h4,h5 FROM home WHERE timestamp > $past;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
        //t1 : parentale
        //t2 : salon
        //t3 : bebe
        //t4 : entrée
        //t5 : garage

      $data[] = "{ \"t\": ".$row['timestamp'].
                ", \"t1\": ".$row['t1'].
                ", \"t2\": ".$row['t2'].
                ", \"t3\": ".$row['t3'].
                ", \"t4\": ".$row['t4'].
                ", \"t5\": ".$row['t5'].
                ", \"h1\": ".$row['h1'].
                ", \"h2\": ".$row['h2'].
                ", \"h3\": ".$row['h3'].
                ", \"h4\": ".$row['h4'].
                ", \"h5\": ".$row['h5']."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getTempHum(7);

?>
