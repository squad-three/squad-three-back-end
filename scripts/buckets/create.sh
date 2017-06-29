#!/bin/bash

API="http://localhost:4741"
URL_PATH="/bucket"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=${TOKEN}" \
  --data '{
    "bucket": {
      "description": "'"${DESCRIPTION}"'"
      "category": "'"${CATEGORY}"'"
      "location": "'"${LOCATION}"'"
      "duration": "'"${DURATION}"'"
      "cost": "'"${COST}"'"
      "status": "'"${STATUS}"'"
      "DT_RowId": "'"${DT_ROWID}"'"
    }
  }'

echo



API="http://localhost:4741"
URL_PATH="/bucket"

curl "http://localhost:4741/bucket" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=o1TGqyUjLy+rEjucmjCZlQ==" \
  --data '{
    "bucket": {
      "description": "Climb redwood",
      "category": "Adventure",
      "location": "Forest",
      "duration": "3 Days",
      "cost": "0",
      "status": "Not started",
      "_owner": "5952984bf3b9651c53fb4a1"
    }
  }'

  "DT_RowId": "1001"
    --header "Authorization: Token token=BtfobX6cYg6M4rJogPWXtA==" \
