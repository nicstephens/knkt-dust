#!/bin/sh

NODE_ENV=development env $(cat .env.local) npx tsx ./src/start.ts -p 3002
