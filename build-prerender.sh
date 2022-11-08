#!/bin/sh
echo "Build project"
npm run prerender

echo "Copy proxy-server to build"
cp scripts/proxy-server.js dist/prod

echo "move prerender pages to locales folder"
node scripts/move-prerender.js
