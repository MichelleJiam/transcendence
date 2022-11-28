#!/bin/bash

GREEN='\033[0;32m'
RESET='\033[0m'

echo -e "${GREEN}building...${RESET}";
docker compose up --build;