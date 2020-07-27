#! /bin/bash

# cd /home/julian/sources/react/roadworks
DATE=`date +%Y-%m-%d`
# ts-node read-page.ts >"roadworks-$DATE.json"
cp "roadworks-$DATE.json" ~/sources/serverless/roadworks.json

read -p "Update roadworks online? [Y/n] " go
if [ -z "$go" -o "$go" = "y" -o "$go" = "Y" ]; then
  cd ~/sources/serverless
  vercel --prod
fi
