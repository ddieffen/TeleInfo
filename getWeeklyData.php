<?php

//All in one
$sqlite = '/home/dietpi/teleinfo.sqlite';

  //
  //  recupere les donnees de puissance des $nb_days derniers jours et les met en forme pour$
  //
  function getWeeklyAverages () {
    global $sqlite;
    $db = new SQLite3($sqlite);
    $results = $db->query("SELECT t1.week, t1.avgtext, t1.sunnrgkwh, t1.sumplui, t2.avgthome, t3.weeklyHC, t3.weeklyHP FROM (SELECT strftime('%Y-%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(case when text > -100 then text else null end) as avgtext,  sum(case when sunext > -100 then sunext else null end)/1000.0 as sunnrgkwh, sum(case when plui > -100 then plui else null end) as sumplui FROM weather GROUP BY week) t1 INNER JOIN (SELECT week, case when avgt4 is null then (avgt1+avgt2+avgt3)/3 else (avgt1+avgt2+avgt3+avgt4)/4 end as avgthome FROM(SELECT strftime('%Y-%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(case when t1 > -100 then t1 else null end) as avgt1, avg(case when t2 > -100 then t2 else null end) as avgt2, avg(case when t3 > -100 then t3 else null end) as avgt3, avg(case when t4 > -100 then t4 else null end) as avgt4, avg(case when t5 > -100 then t5 else null end) as avgt5 FROM home GROUP BY week)) t2 ON (t1.week = t2.week) LEFT JOIN (SELECT strftime('%Y-%W',datetime(timestamp-1, 'unixepoch', 'localtime')) as week, sum(daily_hc) as weeklyHC, sum(daily_hp) as weeklyHP FROM conso GROUP BY week) t3 ON (t1.week = t3.week);");

    $data = array();

    while($row = $results->fetchArray(SQLITE3_ASSOC)){
      $data[] = "{ \"w\": \"".$row['t1.week']."\", \"wText\": "
                .$row['t1.avgtext'].", \"wSunkWh\": "
                .(!is_null($row['t1.sunnrgkwh']) ? $row['t1.sunnrgkwh'] : "0").", \"wThome\": "
                .$row['t2.avgthome'].", \"wHC\": "
                .(!is_null($row['t3.weeklyHC']) ? $row['t3.weeklyHC'] : "0").", \"wHP\": "
                .(!is_null($row['t3.weeklyHP']) ? $row['t3.weeklyHP'] : "0").", \"wPlui\": "
                .$row['t1.sumplui']."}";
    }

    return "[ ".implode(', ', $data)."]";
  }

echo getWeeklyAverages();

?>

