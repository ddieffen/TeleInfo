<?php

  $sqlite = '/home/dietpi/teleinfo.sqlite';

  //
  //  renvoie une trame teleinfo complete sous forme d'array
  //
  function getTeleinfo () {

    $handle = fopen ('/dev/serial0', "r"); // ouverture du flux

    while (fread($handle, 1) != chr(2)); // on attend la fin d'une trame pour commencer a avec la trame suivante

    $char  = '';
    $trame = '';
    $datas = '';

    while ($char != chr(2)) { // on lit tous les caracteres jusqu'a la fin de la trame
      $char = fread($handle, 1);
      if ($char != chr(2)){
        $trame .= $char;
      }
    }

    fclose ($handle); // on ferme le flux

    $trame = chop(substr($trame,1,-1)); // on supprime les caracteres de debut et fin de trame

    $messages = explode(chr(10), $trame); // on separe les messages de la trame

    foreach ($messages as $key => $message) {
      $message = explode (' ', $message, 3); // on separe l'etiquette, la valeur et la somme de controle de chaque message
      if(!empty($message[0]) && !empty($message[1])) {
        $etiquette = $message[0];
        echo($etiquette." = ");
        $valeur    = $message[1];
        echo($valeur."\r\n");
        $datas[$etiquette] = $valeur; // on stock les etiquettes et les valeurs de l'array datas
      }
    }

    return $datas;

  }

  //
  //  enregistre la puissance instantanée en V.A et en W
  //
  function handlePuissance () {
    global $sqlite;
    $success = False;

    for($i = 0; $i <= 10; $i++){

      echo("Trying to handle Puissance #".$i."\r\n");

      $db = new SQLite3($sqlite);
      $db->exec('CREATE TABLE IF NOT EXISTS puissance (timestamp INTEGER, hchp TEXT, va REAL, iinst REAL, watt REAL);'); // cree la table puissance si elle n'existe pas
      $db->exec('CREATE TABLE IF NOT EXISTS energytot (timestamp INTEGER, vah REAL);');
      $db->exec('CREATE TABLE IF NOT EXISTS weather (timestamp INTEGER, text REAL, hext REAL, sunext REAL, tone REAL, hone REAL);'); // cree la table météo si elle n'existe pas
      $db->exec('CREATE TABLE IF NOT EXISTS conso (timestamp INTEGER, total_hc INTEGER, total_hp INTEGER, daily_hc REAL, daily_hp REAL);'); // cree la table conso si elle n'existe pas

      $trame = getTeleinfo (); // recupere une trame teleinfo

      echo("trame recue");

      $datas = array();
      $datas['timestamp'] = time();
      echo("trame PTEC: ".$trame['PTEC']."\r\n");
      $datas['hchp']      = substr($trame['PTEC'],0,2); // indicateur heure pleine/creuse, on garde seulement les carateres HP (heure pleine) et HC (heure creuse)
      echo("datas HCDP: ".$datas['hchp']."\r\n");
      echo("trame PAPP: ".$trame['PAPP']."\r\n");
      $datas['va']        = preg_replace('`^[0]*`','',$trame['PAPP']); // puissance en V.A, on supprime les 0 en debut de chaine
      if($datas['va'] == ""){
        $datas['va'] .= "0";
      }
      echo("datas HCDP: ".$datas['va']."\r\n");
      echo("trame IINST: ".$trame['IINST']."\r\n");
      $datas['iinst']     = preg_replace('`^[0]*`','',$trame['IINST']); // intensité instantanée en A, on supprime les 0 en debut de chaine
      if($datas['iinst'] == ""){
        $datas['iinst'] .= "0";
      }
      echo("datas iinst: ".$datas['iinst']."\r\n");
      $datas['watt']      = $datas['iinst']*220; // intensite en A X 220 V

      echo("trame HCHC: ".$trame['HCHC']."\r\n");
      $vahc = intval(preg_replace('`^[0]*`','',$trame['HCHC'])); // conso total en Wh heure creuse, on supprime les 0 en debut de chaine
      echo("trame HCHP: ".$trame['HCHP']."\r\n");
      $vahp = intval(preg_replace('`^[0]*`','',$trame['HCHP'])); // conso total en Wh heure pleine, on supprime les 0 en debut de chaine
      $consototale = $vahp + $vahc;
      echo("Conso totale actuelle: ".$consototale."\r\n");

      if($db->busyTimeout(5000)){
        $previous = $db->query("SELECT * FROM energytot;")->fetchArray(SQLITE3_ASSOC);
      }
      if(empty($previous)){
        echo("Conso total précédente inconnue, calcul de puissance basé sur la conso et l'intervalle de temp impossible");
      } else {
        $consototaleprecedente = intval($previous['vah']);
        echo("Conso totale preceden: ".$consototaleprecedente."\r\n");
        echo("Timestamp actuel     : ".intval($datas['timestamp'])."\r\n");
        echo("Timestamp precedent  : ".intval($previous['timestamp'])."\r\n");
        $pmoyenne = ($consototale-$consototaleprecedente)*3600/(intval($datas['timestamp'])-intval($previous['timestamp']));
        echo("Puissance moyenne: ".$pmoyenne."\r\n");
        $datas['watt'] = $pmoyenne;
      }

      if($db->busyTimeout(5000)){ // stock les donnees
        if($datas['hchp'] != ""){
          $command = "DELETE FROM energytot;";
          echo($command);
          $success = $db->exec($command);
          if(!$success){
            error_log(time()." Transaction Failed:". $db->lastErrorMsg(), 3, "/var/log/apache2/error.log");
          }

          $command = "INSERT INTO energytot (timestamp, vah) VALUES (".$datas['timestamp'].", '".$consototale."');";
          echo($command);
          $success = $db->exec($command);
          if(!$success){
            error_log(time()." Transaction Failed:". $db->lastErrorMsg(), 3, "/var/log/apache2/error.log");
          }

          $command = "INSERT INTO puissance (timestamp, hchp, va, iinst, watt) VALUES (".$datas['timestamp'].", '".$datas['hchp']."', ".$datas['va'].", ".$datas['iinst'].", ".$datas['watt'].");";
          echo($command);
          $success = $db->exec($command);
          if(!$success){
            error_log(time()." Transaction Failed:". $db->lastErrorMsg(), 3, "/var/log/apache2/error.log");
          }
        }
      }
      $db->close();
      if($success == True){
        echo("Break\r\n");
        break;
      }

    }
    return 1;
  }

  //
  //  enregistre la consommation en Wh
  //
  function handleConso () {

    global $sqlite;
    $success = False;

    for($i = 0; $i <= 10; $i++){
      echo("Trying to handle Conso #".$i."\r\n");
      $db = new SQLite3($sqlite);
      $db->exec('CREATE TABLE IF NOT EXISTS conso (timestamp INTEGER, total_hc INTEGER, total_hp INTEGER, daily_hc REAL, daily_hp REAL);'); // cree la table conso si elle n'existe pas
      $trame     = getTeleinfo (); // recupere une trame teleinfo
      $today     = strtotime('today 00:00:00');
      $yesterday = strtotime("-1 day 00:00:00");
      // recupere la conso totale enregistree la veille pour pouvoir calculer la difference et obtenir la conso du jour
      if($db->busyTimeout(5000)){
        $previous = $db->query("SELECT * FROM conso WHERE timestamp = '".$yesterday."';")->fetchArray(SQLITE3_ASSOC);
      }
      if(empty($previous)){
        $previous = array();
        $previous['timestamp'] = $yesterday;
        $previous['total_hc']  = 0;
        $previous['total_hp']  = 0;
        $previous['daily_hc']  = 0;
        $previous['daily_hp']  = 0;
      }
      $datas = array();
      $datas['query']     = 'hchp';
      $datas['timestamp'] = $today;
      echo("trame HCHC: ".$trame['HCHC']."\r\n");
      $datas['total_hc']  = preg_replace('`^[0]*`','',$trame['HCHC']); // conso total en Wh heure creuse, on supprime les 0 en debut de chaine
      echo("trame HCHP: ".$trame['HCHP']."\r\n");
      $datas['total_hp']  = preg_replace('`^[0]*`','',$trame['HCHP']); // conso total en Wh heure pleine, on supprime les 0 en debut de chaine

      if($previous['total_hc'] == 0){
        $datas['daily_hc'] = 0;
      }
      else{
        $datas['daily_hc']  = ($datas['total_hc']-$previous['total_hc'])/1000; // conso du jour heure creuse = total aujourd'hui - total hier, on divise par 1000 pour avec un resultat en kWh
      }

      if($previous['total_hp'] == 0){
        $datas['daily_hp'] = 0;
      }
      else{
        $datas['daily_hp']  = ($datas['total_hp']-$previous['total_hp'])/1000; // conso du jour heure pleine = total aujourd'hui - total hier, on divise par 1000 pour avec un resultat en kWh
      }

      if($db->busyTimeout(5000)){ // stock les donnees
        $query = "INSERT INTO conso (timestamp, total_hc, total_hp, daily_hc, daily_hp) VALUES (".$datas['timestamp'].", ".$datas['total_hc'].", ".$datas['total_hp'].", ".$datas['daily_hc'].", ".$datas['daily_hp'].");";
        $success = $db->exec($query);
        if(!$success){
          error_log(time()." Transaction Failed:". $db->lastErrorMsg(), 3, "/var/log/apache2/error.log");
        }
      }
    $db->close();
      if($success == True){
        echo("Break\r\n");
        break;
      }
    }
  }

  function getLatestVA (){
    global $sqlite;
    $query = "SELECT * FROM puissance WHERE timestamp=(SELECT max(timestamp) FROM puissance);";
    $db = new SQLite3($sqlite);
    $results = $db->query($query);
    $latestVA = "";
    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $latestVA = $row['watt'];
    }

    return $latestVA;
  }

  //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour les afficher sur le graphique
  //
  function getInstantConsumption ($nb_days) {
    global $sqlite;
    $now  = time();
    $past = strtotime("-$nb_days day", $now);
    $db = new SQLite3($sqlite);
    $results = $db->query("SELECT * FROM puissance WHERE timestamp > $past ORDER BY timestamp ASC;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $year   = date("Y", $row['timestamp']);
      $month = date("n", $row['timestamp'])-1;
      $day    = date("j", $row['timestamp']);
      $hour   = date("G", $row['timestamp']);
      $minute = date("i", $row['timestamp']);
      $second = date("s", $row['timestamp']);
      if ($row['hchp'] == 'HP') {$hchp_indicator ='color: #e0440e';} else {$hchp_indicator = 'color: #375D81';}
      $data[] = "[{v:new Date($year, $month, $day, $hour, $minute, $second), f:'".date("j", $row['timestamp'])." ".date("M"
                  , $row['timestamp'])." ".date("H\hi", $row['timestamp'])."'},
                  {v:".$row['watt'].", f:'".$row['watt']." V.A'}, '".$hchp_indicator."']";
    }

    return implode(', ', $data);
  }

  //
  //  recupere les donnees de consommation des $nb_days derniers jours et les met en forme pour les afficher sur le graphique
  //
  function getDailyData ($nb_days) {
    global $sqlite;
    $now  = time();
    $past = strtotime("-$nb_days day", $now);

    $db = new SQLite3($sqlite);
    $results = $db->query("SELECT timestamp, daily_hc, daily_hp FROM conso WHERE timestamp > $past ORDER BY timestamp ASC;");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      //-86400 pour enlever un jour puisque les consommation sont sommées a minuit pour la journee
      //autrement elles apparaissent dans le graph comme les conso de la journee en cours
      $year = date("Y", $row['timestamp']-86400);
      $month = date("n", $row['timestamp']-86400)-1;
      $day = date("j", $row['timestamp']-86400);
      $data[] = "[new Date($year, $month, $day), {v:".$row['daily_hp'].", f:'".$row['daily_hp']." kVAh'}, {v:".$row['daily_hc'].", f:'".$row['daily_hc']." kVAh'}]";
    }

    return implode(', ', $data);
  }


?>
