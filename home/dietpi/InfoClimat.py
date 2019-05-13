# Python program to find curren
# weather details of any city
# using openweathermap api

# import required modules
from lxml import html
import requests
import re
import sqlite3
import time

# base_url variable to store url
base_url = "https://www.infoclimat.fr/cartes/observations-meteo/temps-reel/radiations-solaires/france.html"

# get method of requests module
# return response object
page = requests.get(base_url)
tree = html.fromstring(page.content)

area = tree.xpath('//area[@alt[contains(.,"Pluguffan")]]')
altArea = area[0].attrib['alt']

# print "Area", altArea

spt = altArea.replace('hr','br').split('<br />')

text = re.findall("[\.0-9]*", spt[2].split('</b> ')[1])[0]
pext = re.findall("[\.0-9]*", spt[6].split('</b> ')[1])[0]
hext = re.findall("[\.0-9]*", spt[7].split('</b> ')[1])[0]
if hext == "":
        hext = "-1"

sunp = "-1"

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

timestamp = str(int(time.time()))

query = "INSERT INTO weather (timestamp, text, hext, sunext) VALUES ("+timestamp+", "+text+", "+hext+", "+sunp+");"

print query

database = "/home/dietpi/teleinfo.sqlite"
conn = sqlite3.connect('/home/dietpi/teleinfo.sqlite')
cursor = conn.cursor()
cursor.execute(query)
conn.commit()
conn.close()
