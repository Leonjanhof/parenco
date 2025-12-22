#!/bin/sh
set -e

# Install using the lockfile to ensure reproducible builds
npm ci --prefix parenco

# Build then serve (PORT comes from Railway)
npm run build --prefix parenco
npm run start --prefix parenco

