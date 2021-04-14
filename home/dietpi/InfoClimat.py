# Python program to find curren
# weather details of any city
# using openweathermap api

# import required modules
from lxml import html
import requests
import re
import sqlite3
import time
import logging

text = "-100"
pext = "-100"
hext = "-100"
sunp = "-100"
plui = "-100"

# base_url variable to store url
logging.basicConfig(filename='InfoClimat.log', filemode='a', format='%(name)s - %(levelname)s - %(message)s')
base_url = "https://www.infoclimat.fr/cartes/observations-meteo/temps-reel/radiations-solaires/france.html"

timestamp = str(int(time.time()))
logging.info('Got current time')

try:
    # get method of requests module
    # return response object
    print base_url
    page = requests.get(base_url)
    print "REQUEST===================================================="
    print page.encoding
    tree = html.fromstring(page.text)

    print tree

    area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
    altArea = area[0].attrib['alt']

    print "Area", altArea

    if "Partenariat" in altArea:
        print "Complete bloc!"
    else:
        print "Incomlete retying"
        time.sleep(5)
        page = requests.get(base_url)
        tree = html.fromstring(page.text)
        area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
        altArea = area[0].attrib['alt']

    spt = altArea.replace('hr','br').split('<br />')

    print "Split2", spt[2]

    text = re.findall("[+-]?\d+(?:\.\d+)?", spt[2].split('</b> ')[1])[0]
    pext = re.findall("[+-]?\d+(?:\.\d+)?", spt[6].split('</b> ')[1])[0]

    print "Idx 2 Temp", text
    print "Idx 6 Pres", pext

    for i in range(0, len(spt)):
       sunsplit = spt[i].split('</b> ')
       print "tested string", sunsplit
       if len(sunsplit) > 1 and "W/m" in sunsplit[1]:
           sunp = re.findall("[+-]?\d+(?:\.\d+)?", sunsplit[1])[0]
           print "Sun ", sunp
       else:
           print "No sun power line", i
       if len(sunsplit) > 1 and "%" in sunsplit[1]:
           hext = re.findall("[+-]?\d+(?:\.\d+)?", sunsplit[1])[0]
           print "Hext ", hext
       else:
           print "No Humidity line", i
       if len(sunsplit) > 1 and "mm" in sunsplit[1]:
           plui = re.findall("[+-]?\d+(?:\.\d+)?", sunsplit[1])[0]
           print "Pluie ", plui
       else:
           print "No Rain line", i

    checked = "1"

except Exception, e:
    print "No Connection Exception : " + str(e)

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
