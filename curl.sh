curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer TEST_API_KEY:a7a4cd28f2e310326564513cd7d0e3e9:8edcd0aea5fd4efda94c8be3b6dfceed' \
  --data '
{
  "idempotencyKey": "c4243e15-997f-4b22-9b11-aa6a03c3247e",
  "address": "0x5b18b319feb5ae8b3dddac5d09b4adaddeeca642",
  "chain": "ETH-SEPOLIA"
}
'