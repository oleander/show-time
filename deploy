#!/bin/sh -e

APP=NeverAgain

echo "Remove old app"
rm -rf dist/`echo $APP`.app

echo "Remove current build path"
rm -rf build

echo "Generate static files"
ember build --environment=production --output-path=build/

echo "Copy static files to build"
cp package.json main.js build
cp config.json build/
echo "mode=production" > "build/environment"
cp -r assets/ build/assets

echo "Build package using electron-packager"
./node_modules/electron-packager/cli.js build `echo $APP` --out=dist/ --app-version=0.25.1 --icon=assets/icon.icns --prune --asar

echo "Remove build path"
rm -rf build

echo dist/`echo $APP`.app "has been created"