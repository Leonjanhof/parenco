#!/bin/sh
set -e

# Install using the lockfile (include devDeps so Vite is available)
npm ci --prefix parenco --include=dev

# Build then serve (PORT comes from Railway)
npm run build --prefix parenco
npm run start --prefix parenco

