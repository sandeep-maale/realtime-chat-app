#!/bin/bash

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install Docker before running this script."
  exit 1
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Docker Compose is not installed. Please install Docker Compose before running this script."
  exit 1
fi

# Build Docker Compose services
docker-compose build

# Start Docker Compose services in detached mode
docker-compose up -d

