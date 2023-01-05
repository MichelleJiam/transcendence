#!/bin/bash

intraNames=("mjiam" "nhariman" "nvan-win" "salbregh" "smiller")

for i in ${!intraNames[@]}; do

  jsonVar="{\
	\"intraId\" : \"${i}\",\
	\"playerName\" : \"${intraNames[$i]}\",\
	\"password\" : \"${intraNames[$i]}123\"\
  }"
  curl -v "localhost:3000/user/create/" -H "Content-Type: application/json" -d "$jsonVar"
  sleep 1
done
