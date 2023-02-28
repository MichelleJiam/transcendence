#!/bin/bash

# Get Auth cookie for access to protected routes
# Requires that you've logged in before, so that there's a user with id 1 in the database.
curl -X GET "localhost:3000/auth/test_login/1" -c ../cookie_jar.env # save cookie into this file

intraNames=("mjiam" "nhariman" "nvan-win" "salbregh" "smiller" "john" "flip" "jelle" "tessa" "edwin" "idris" "lisa" "max" "jos" "carine" "cilia" "kim" "jim" "shireen" "erik" "bart" "teun" "jochem")

for i in ${!intraNames[@]}; do

  jsonVar="{\
	\"intraId\" : \"${i}\",\
	\"playerName\" : \"${intraNames[$i]}\"\
  }"
  curl -v "localhost:3000/user/create/" -H "Content-Type: application/json" -d "$jsonVar" \
  	-b ../cookie_jar.env # load cookies from saved file into request
  sleep 1
done
