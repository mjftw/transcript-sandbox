#!/bin/bash

# Navigate to Phoenix app directory and start the server
cd phoenix-app
mix phx.server &
PHOENIX_PID=$!

# Navigate to NextJS app directory and start the server
cd ../nextjs-app
npm run dev &
NEXTJS_PID=$!

# Capture termination signals and kill both processes
trap "kill $PHOENIX_PID && kill $NEXTJS_PID" EXIT

# Wait indefinitely
while true; do
    sleep 1
done
