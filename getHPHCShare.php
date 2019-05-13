<?php

$sqlite = '/home/dietpi/teleinfo.sqlite';

  //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour les afficher sur le graphique
  //
  function getHPHCShare ($nb_days) {
    global $sqlite;
    $now  = time();
    $past = strtotime("-$nb_days day", $now);
    $db = new SQLite3($sqlite);

    $query = "SELECT SUM(daily_hc), SUM(daily_hp) FROM conso WHERE timestamp > $past;";
    $results = $db->query($query);
    $data = array();

    $totalHP = 0;
    $totalHC = 0;
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $totalHP = $row['SUM(daily_hc)'];
      $totalHC = $row['SUM(daily_hp)'];

      $somme = $totalHP + $totalHC;

      $totalHP=$totalHP/$somme;
      $totalHC=$totalHC/$somme;

      $data[] = "{ \"label\": \"hp\", \"value\": ".$totalHP."}, "
               ."{ \"label\": \"hc\", \"value\": ".$totalHC."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getHPHCShare(365);

?>
