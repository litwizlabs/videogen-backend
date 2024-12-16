#!/bin/bash

# Get the tag from the first argument, or use 'latest' as the default
TAG=${1:-latest}

# Navigate to the source directory
cd ../../ && \

# Build the Docker image with the specified tag
sudo docker buildx build . -t wizstudio.azurecr.io/videogen-backend:$TAG --platform linux/arm64,linux/amd64 --push