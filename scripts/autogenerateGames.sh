#!/bin/bash

  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "1", "winnerScore": "54", "loserId": "4", "loserScore": "15" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "1", "winnerScore": "89", "loserId": "5", "loserScore": "19" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "3", "winnerScore": "77", "loserId": "1", "loserScore": "24" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "2", "winnerScore": "68", "loserId": "1", "loserScore": "28" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "5", "winnerScore": "57", "loserId": "3", "loserScore": "32" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winnerId": "2", "winnerScore": "94", "loserId": "2", "loserScore": "45" }'
