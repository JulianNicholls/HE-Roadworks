#! /bin/bash

# cd /home/julian/sources/react/roadworks
DATE=`date +%Y-%m-%d`
npx ts-node read-page.ts >"roadworks-$DATE.json"
cp "roadworks-$DATE.json" ~/sources/serverless/roadworks.json

read -p "Update roadworks online? [Y/n] " go
if [ -z "$go" -o "$go" = "y" -o "$go" = "Y" ]; then
  cd ~/sources/serverless
  vercel --prod
fi

read -p "Check in new roadworks file? [Y/n] " go
if [ -z "$go" -o "$go" = "y" -o "$go" = "Y" ]; then
  cd ~/sources/serverless
  git add roadworks.json
  git commit -m "Latest roadworks $DATE"
fi

