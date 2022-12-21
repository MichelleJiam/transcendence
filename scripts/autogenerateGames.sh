#!/bin/bash

  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "1", "winner_score": "54", "loser_id": "4", "loser_score": "15" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "1", "winner_score": "89", "loser_id": "5", "loser_score": "19" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "3", "winner_score": "77", "loser_id": "1", "loser_score": "24" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "2", "winner_score": "68", "loser_id": "1", "loser_score": "28" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "5", "winner_score": "57", "loser_id": "3", "loser_score": "32" }'
  curl -v "localhost:3000/game/create/" -H 'Content-Type: application/json' -d '{ "winner_id": "2", "winner_score": "94", "loser_id": "2", "loser_score": "45" }'
