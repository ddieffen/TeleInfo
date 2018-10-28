#!/bin/bash

if ifconfig wlan0 | grep -q "inet 192.168.1" ; then
	echo "Network is up and running"
	sleep 10
else
	echo "Network connection down! Attempting reconnection."
	ifup --force wlan0
	sleep 10
fi

