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
    $somme = 0;
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $totalHP = floatval($row['SUM(daily_hp)']);
      $totalHC = floatval($row['SUM(daily_hc)']);

      $somme = $totalHP + $totalHC;
    }

    $a = "Tarif HP/HC = 123.60E + $totalHP * 0.1580E + $totalHC * 0.1230E <br>";
    $b = "            =".strval(123.60+$totalHP*0.1580+$totalHC*0.1230)."E <br>";
    $c = "Tarif Base  = 110.52E + $somme * 0.1452E <br>";
    $d = "            =".strval(110.52+$somme*0.1452)."E <br>";
    return $a.$b.$c.$d;
 }

echo getHPHCShare(365);

?>
