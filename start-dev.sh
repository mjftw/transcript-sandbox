#!/bin/bash

SECRET_KEY="supersecret"

# Navigate to Phoenix app directory and start the server
cd phoenix-app
WEBSOCKET_SECRET=$SECRET_KEY mix phx.server &
PHOENIX_PID=$!

# Navigate to NextJS app directory and start the server
cd ../nextjs-app
PHOENIX_WEBSOCKET_SECRET=$SECRET_KEY npm run dev &
NEXTJS_PID=$!

# Capture termination signals and kill both processes
trap "kill $PHOENIX_PID && kill $NEXTJS_PID" EXIT

# Wait indefinitely
while true; do
    sleep 1
done
