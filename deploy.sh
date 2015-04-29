#!/bin/sh -e

echo "Remove current build path"
rm -rf build

echo "Generate static files"
ember build --environment=production --output-path=build/

echo "Copy static files to build"
cp package.json main.js build

echo "Create .env file"
echo "ENV=production" > "build/.env"

echo "Build package using electron-packager"
electron-packager build Hello

echo "Remove build path"
rm -rf build

echo "Install dependencies"
cd Hello.app/Contents/Resources/app
npm install --production