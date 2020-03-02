#! /bin/bash

# cd /home/julian/sources/react/roadworks
DATE=`date +%Y-%m-%d`
ts-node read-page.ts >"roadworks-$DATE.json"
