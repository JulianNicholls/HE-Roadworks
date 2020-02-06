#! /bin/bash

cd /home/julian/sources/react/roadworks
DATE=`date +%Y-%m-%d`
/home/julian/.nvm/versions/node/v13.3.0/bin/node read-page.js >"roadworks-$DATE.json"
