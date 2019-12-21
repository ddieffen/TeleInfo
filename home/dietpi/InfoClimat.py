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
plui = "0"

# base_url variable to store url
base_url = "https://www.infoclimat.fr/cartes/observations-meteo/temps-reel/radiations-solaires/france.html"

timestamp = str(int(time.time()))

try:
    # get method of requests module
    # return response object
    page = requests.get(base_url)
    print "REQUEST===================================================="
    print page.encoding
    tree = html.fromstring(page.text)

    area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
    altArea = area[0].attrib['alt']

    # print "Area", altArea
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
           print "No Rain line", i

    checked = "1"

except Exception:
    print "No Connection Exception"

query = "INSERT INTO weather (timestamp, text, hext, sunext, plui) VALUES ("+timestamp+", "+text+", "+hext+", "+sunp+", "+plui+");"

print query

database = "/home/dietpi/teleinfo.sqlite"
conn = sqlite3.connect('/home/dietpi/teleinfo.sqlite')
cursor = conn.cursor()
try:
    cursor.execute(query)
    conn.commit()
finally:
    conn.close()
