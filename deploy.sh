#!/bin/bash

# Simple deployment script for the TBB project
# This script will build and deploy both frontend and backend on the same machine

# Make the script exit on error
set -e

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if the GEMINI_API_KEY is set
if [ -z "${GEMINI_API_KEY}" ]; then
    # Check if it's in the .env file
    if [ -f .env ] && grep -q "GEMINI_API_KEY" .env; then
        echo "GEMINI_API_KEY found in .env file."
    else
        echo "GEMINI_API_KEY is not set. Please set it before deploying."
        echo "You can either: "
        echo "1. Export it as an environment variable: export GEMINI_API_KEY=your_key_here"
        echo "2. Add it to the .env file in the root directory: GEMINI_API_KEY=your_key_here"
        exit 1
    fi
fi

echo "=== Building and deploying TBB project ==="
echo "This will deploy both frontend and backend on port 80."

# Build the images
echo "Building Docker images..."
docker-compose -f docker-compose.simple.yml build

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose.simple.yml down || true

# Start the containers
echo "Starting containers..."
docker-compose -f docker-compose.simple.yml up -d

echo "=== Deployment complete ==="
echo "The application is now accessible at http://localhost"
echo "To view logs, run: docker-compose -f docker-compose.simple.yml logs -f"
echo "To stop the application, run: docker-compose -f docker-compose.simple.yml down" 