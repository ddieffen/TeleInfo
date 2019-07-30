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
plui = "-1"
checked = 0

query = "SELECT * FROM weather WHERE (text = -1 OR hext = -1 OR sunext = -1 OR plui = -1) AND (checked IS NULL OR checked <= 11) ORDER BY timestamp DESC;"
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
    if row[5] is None:
        plui = -1;
    else:
        plui = row[5]

    print "Original data    text="+str(text)+" hext="+str(hext)+" sunext="+str(sunp)+" checked="+str(checked)+" pluie="+str(plui)
    try:
        # get method of requests module return response object
        page = requests.get(base_url)
        print "REQUEST===================================================="
        print page.encoding
        #tree = html.fromstring(page.content)
        #What is the main difference in parsing HTML with .content or .text?

        #When you make a request, Requests makes educated guesses about the
        #encoding of the response based on the HTTP headers. The text encoding guessed
        #by Requests is used when you access r.text. You can find out what encoding
        #Requests is using, and change it, using the r.encoding property

        #If you change the encoding, Requests will use the new value of r.encoding
        #whenever you call r.text. You might want to do this in any situation where
        #you can apply special logic to work out what the encoding of the content
        #will be. For example, HTTP and XML have the ability to specify their
        #encoding in their body. In situations like this, you should use r.content
        #to find the encoding, and then set  r.encoding. This will let you use r.text
        #with the correct encoding.
        pagetext = page.text
        print "Pagetext OK"

        tree = html.fromstring(pagetext)
        print "Tree OK"

        checked = checked + 1

        area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
        print "Area selection OK"

        print len(area)

        altArea = area[0].attrib['alt']

        print "Area OK"
        spt = altArea.replace('hr','br').split('<br />')

        text = re.findall("[\.0-9]*", spt[2].split('</b> ')[1])[0]
        pext = re.findall("[\.0-9]*", spt[6].split('</b> ')[1])[0]

        print "Idx 2 Temp", text
        print "Idx 6 Pres", pext
        print "Idx 7 Hygr", hext

        for i in range(0, len(spt)):
           sunsplit = spt[i].split('</b> ')
           if len(sunsplit) > 1 and "W/m" in sunsplit[1]:
               sunp = re.findall("[\.0-9]*", sunsplit[1])[0]
               print "Sun ", sunp
           else:
               print "No sun power line", i
           if len(sunsplit) > 1 and "%" in sunsplit[1]:
               hext = re.findall("[\.0-9]*", sunsplit[1])[0]
               print "Hext ", hext
           else:
               print "No Humidity line", i
           if len(sunsplit) > 1 and "mm" in sunsplit[1]:
               plui = re.findall("[\.0-9]*", sunsplit[1])[0]
               print "Pluie ", plui
           else:
               print "No rain line", i

    except Exception, e:
        print "No Connection Exception"
        print str(e)

    conn2 = sqlite3.connect(database)
    query = "UPDATE weather SET text = "+str(text)+", hext = "+str(hext)+", sunext = "+str(sunp)+", checked = "+str(checked)+", plui = "+str(plui)+" WHERE timestamp = "+str(row[0])+";"
    print query
    cursor2 = conn2.cursor()
    try:
        cursor2.execute(query)
        conn2.commit()
    finally:
        conn2.close()
