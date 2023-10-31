#!/bin/bash

set -eo pipefail

# Navigate to Phoenix app directory and start the deployment
cd phoenix-app
fly deploy

# Navigate to NextJS app directory and start the deployment

cd ../nextjs-app
fly deploy
