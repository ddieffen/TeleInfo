# Python program to find curren
# weather details of any city
# using openweathermap api

# import required modules
from lxml import html
import requests
import re
import sqlite3
import time

text = "-1"
pext = "-1"
hext = "-1"
sunp = "-1"
checked = 0

query = "SELECT * FROM weather WHERE (text = -1 OR hext = -1 OR sunext = -1) AND (checked IS NULL OR checked <= 10) ORDER BY timestamp DESC LIMIT 20;"
database = "/home/dietpi/teleinfo.sqlite"
conn = sqlite3.connect(database)
cursor = conn.cursor()
try:
    cursor.execute(query)
    results = list(cursor)
finally:
    conn.close()

mois =["janvier","fevrier","mars","avril`","mai","juin","juillet","aout","septembte","octobre","novembre","decembre"]

for row in results:
    print "Timestamp=" + str(row[0])
    nmois = int(time.strftime("%m", time.gmtime(row[0])))
    nday  = int(time.strftime("%d", time.gmtime(row[0])))
    nyear = int(time.strftime("%Y", time.gmtime(row[0])))
    nhour = int(time.strftime("%H", time.gmtime(row[0])))
    smois = mois[nmois-1]
    if nday==1:
      sday = "1er";
    else:
      sday = str(nday)
    if nhour < 10:
      shour = "0"+str(nhour)
    else:
      shour = str(nhour)

    print "Tentative"
    base_url = "https://www.infoclimat.fr/cartes/observations-meteo/archives/radiations-solaires/" + sday +"/" + smois +"/" + str(nyear) + "/" + shour + "h/france.html"
    print base_url

    text = row[1]
    hext = row[2]
    sunp = row[3]
    if row[4] is None:
        checked = 0
    else:
        checked = int(row[4])
    print "Original data    text="+str(text)+" hext="+str(hext)+" sunext="+str(sunp)+" checked="+str(checked)
    try:
        # get method of requests module return response object
        page = requests.get(base_url)
        tree = html.fromstring(page.content)

        checked = checked + 1

        area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
        altArea = area[0].attrib['alt']

        print "Area", altArea
        spt = altArea.replace('hr','br').split('<br />')

        text = re.findall("[\.0-9]*", spt[2].split('</b> ')[1])[0]
        pext = re.findall("[\.0-9]*", spt[6].split('</b> ')[1])[0]
        hext = re.findall("[\.0-9]*", spt[7].split('</b> ')[1])[0]
        if hext == "":
            hext = "-1"

        print "Idx 2 Temp", text
        print "Idx 6 Pres", pext
        print "Idx 7 Hygr", hext

        if len(spt) >= 15:
           sunsplit = spt[14].split('</b> ')
           if len(sunsplit) > 1:
               sunp = re.findall("[\.0-9]*", sunsplit[1])[0]
               print "Idx14 Sun ", sunp
           else:
               print "No sun power"
    except:
        print "No Connection Exception"

    conn2 = sqlite3.connect(database)
    query = "UPDATE weather SET text = "+str(text)+", hext = "+str(hext)+", sunext = "+str(sunp)+", checked = "+str(checked)+" WHERE timestamp = "+str(row[0])+";"
    print query
    cursor2 = conn2.cursor()
    try:
        cursor2.execute(query)
        conn2.commit()
    finally:
        conn2.close()
