#!/usr/bin/env python3
"""Demo file showing how to use the mitemp library."""

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

    timestamp = str(int(time.time()))

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

    query = "INSERT INTO home (timestamp, t1, h1, b1, t2, h2, b2, t3, h3, b3) VALUES ("+timestamp+", "+t1+", "+h1+", "+b1+", "+t2+", "+h2+", "+b2+", "+t3+", "+h3+", "+b3+");"

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
