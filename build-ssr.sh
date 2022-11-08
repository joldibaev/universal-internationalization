#!/bin/sh
echo "Build project"
npm run build:ssr

echo "Copy proxy-server to build"
cp scripts/proxy-server.js dist/prod
