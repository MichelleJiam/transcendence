#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
RESET='\033[0m'

PS3="Select a clean option:"
select option in  "clean" "clean all"

do
	case $option in
		"clean")
            echo -e "${GREEN}cleaning...${RESET}";
            docker system prune -af;
            echo -e "${GREEN}still cleaning...${RESET}";
            docker compose down --rmi all;
			break;;
		"clean all")
            echo -e "${GREEN}cleaning...${RESET}";
            docker system prune -af --volumes;
            echo -e "${GREEN}still cleaning...${RESET}";
            docker compose down --rmi all --volumes;
			break;;

	*)
        echo -e "${RED}Invalid selection. Please try again.${RESET}";
    esac
done