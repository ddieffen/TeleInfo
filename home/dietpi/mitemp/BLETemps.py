#!/usr/bin/env python3
"""Demo file showing how to use the mitemp library."""

import subprocess
import argparse
import re
import logging
import sys
import sqlite3
import time
import datetime

from btlewrap import available_backends, BluepyBackend
from mitemp_bt.mitemp_bt_poller import MiTempBtPoller, \
    MI_TEMPERATURE, MI_HUMIDITY, MI_BATTERY

#CREATE TABLE home (timestamp INTEGER, t1 REAL /* temperature C parentale */, h1 REAL /* humidity re parentale */, b1 REAL /* battery parentale */, t2 REAL /* temperature C salon */, h2 REAL /* humidity re salon */, b2 REAL /* battery salon */, t3 REAL /* temperature C baby */, h3 REAL /* humidity re baby */, b3 REAL /* battery baby*/);

def poll():
    t1 = "-1"
    h1 = "-1"
    b1 = "-1"
    t2 = "-1"
    h2 = "-1"
    b2 = "-1"
    t3 = "-1"
    h3 = "-1"
    b3 = "-1"
    t4 = "-1"
    h4 = "-1"
    b4 = "-1"
    t5 = "-1"
    h5 = "-1"
    b5 = "-1"
    aqi = "-1"

    timestamp = str(int(time.time()))

    try:
        print("Tentative PM2.5 Allumage capteur")
        myCmd = subprocess.Popen(['miio', 'control', '192.168.1.36', 'power', 'on'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        stdout,stderr = myCmd.communicate()
    except:
        print("Exception PM2.5 a l'allumage")


    """Poll data from the sensor."""
    backend = BluepyBackend
    mac = "58:2D:34:30:B2:E8" #chambre parentale
    try:
        print("Tentative Parentale")
        poller = MiTempBtPoller(mac, backend)
        b1 = format(poller.parameter_value(MI_BATTERY))
        t1 = format(poller.parameter_value(MI_TEMPERATURE))
        h1 = format(poller.parameter_value(MI_HUMIDITY))
        print("Battery: " + b1)
        print("Temperature: " + t1)
        print("Humidity: " + h1)
    except Exception as e:
        print("Exception Parentale")
        print(e)

    mac = "58:2D:34:30:AC:2E" #salon
    try:
        print("Tentative Salon")
        poller = MiTempBtPoller(mac, backend)
        b2 = format(poller.parameter_value(MI_BATTERY))
        print("Battery: " + b2)
        t2 = format(poller.parameter_value(MI_TEMPERATURE))
        print("Temperature: " + t2)
        h2 = format(poller.parameter_value(MI_HUMIDITY))
        print("Humidity: " + h2)
    except:
        print("Exception Salon")

    mac = "58:2D:34:30:B2:D3" #bébé
    try:
        print("Tentative Bebe")
        poller = MiTempBtPoller(mac, backend)
        b3 = format(poller.parameter_value(MI_BATTERY))
        print("Battery: " + b3)
        t3 = format(poller.parameter_value(MI_TEMPERATURE))
        print("Temperature: " + t3)
        h3 = format(poller.parameter_value(MI_HUMIDITY))
        print("Humidity: " + h3)
    except:
        print("Exception Bebe")

    mac = "58:2D:34:30:B7:1E" #entree
    try:
        print("Tentative Entree")
        poller = MiTempBtPoller(mac, backend)
        b4 = format(poller.parameter_value(MI_BATTERY))
        print("Battery: " + b4)
        t4 = format(poller.parameter_value(MI_TEMPERATURE))
        print("Temperature: " + t4)
        h4 = format(poller.parameter_value(MI_HUMIDITY))
        print("Humidity: " + h4)
    except:
        print("Exception Entree")

    mac = "58:2D:34:30:B6:9E" #salle de bains
    try:
        print("Tentative salle de bains")
        poller = MiTempBtPoller(mac, backend)
        b5 = format(poller.parameter_value(MI_BATTERY))
        print("Battery: " + b5)
        t5 = format(poller.parameter_value(MI_TEMPERATURE))
        print("Temperature: " + t5)
        h5 = format(poller.parameter_value(MI_HUMIDITY))
        print("Humidity: " + h5)
    except:
        print("Exception salle de bains")

    try:
        print("Tentative PM2.5 par Wifi")
        myCmd = subprocess.Popen(['miio', 'control', '192.168.1.36', 'pm2.5'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        stdout,stderr = myCmd.communicate()
        spt = stdout.split(b'\n');
        for i in range(0, len(spt)):
            if spt[i].isdigit():
                regexp = re.findall("[0-9]*", str(spt[i]))
                aqi = regexp[2]
                print("AQI: " + aqi)
    except:
        print("Exception PM2.5")

    try:
        print("Tentative PM2.5 extinction capteur")
        myCmd = subprocess.Popen(['miio', 'control', '192.168.1.36', 'power', 'off'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        stdout,stderr = myCmd.communicate()
    except:
        print("Exception PM2.5 a l'extinction")

    query = "INSERT INTO home (timestamp, t1, h1, b1, t2, h2, b2, t3, h3, b3, t4, h4, b4, t5, h5, b5, pm25) VALUES ("+timestamp+", "+t1+", "+h1+", "+b1+", "+t2+", "+h2+", "+b2+", "+t3+", "+h3+", "+b3+", "+t4+", "+h4+", "+b4+", "+t5+", "+h5+", "+b5+", "+aqi+");"

    print(query)

    database = "/home/dietpi/teleinfo.sqlite"
    conn = sqlite3.connect('/home/dietpi/teleinfo.sqlite')
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    conn.close()

def main(argv):
    if datetime.datetime.now().minute % 5 == 0:
        poll()
    else:
        print("not 5 min")


if __name__ == '__main__':
    main(sys.argv[1:])
