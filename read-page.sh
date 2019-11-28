#! /bin/bash

DATE=`date +%Y-%m-%d`
node read-page.js >"roadworks-$DATE.json"
