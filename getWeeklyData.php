//recuperer lenergie consommee charque semaine
$query = "SELECT strftime('%Y-%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, sum(daily_hc), sum(daily_hp) FROM conso GROUP BY week;"

//recupère l'ensoleillement et la moyenne de tExt chaque semaine
$query = "SELECT strftime('%Y-%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(case when text > -1 then text else null end) as avgtext,  sum(case when sunext > -1 then sunext else null end)/1000.0 as sunnrgkwh FROM weather GROUP BY week;"

//recupere la moyenne des temperatures interieures
$query = "SELECT week, case when avgt4 is null then (avgt1+avgt2+avgt3)/3 else (avgt1+avgt2+avgt3+avgt4)/4 end as avgthome FROM(SELECT strftime('%Y-%W',datetime(timestamp, 'unixepoch', 'localtime')) as week, avg(case when t1 > -1 then t1 else null end) as avgt1, avg(case when t2 > -1 then t2 else null end) as avgt2, avg(case when t3 > -1 then t3 else null end) as avgt3, avg(case when t4 > -1 then t4 else null end) as avgt4, avg(case when t5 > -1 then t5 else null end) as avgt5 FROM home GROUP BY week);"

