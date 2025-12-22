#!/bin/sh
set -e

cd parenco

# install deps if node_modules absent (Railway cache will reuse)
if [ ! -d node_modules ]; then
  npm install
fi

# build then serve via preview on provided PORT (falls back to 4173)
npm run build
npm run start

