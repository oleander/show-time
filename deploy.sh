#!/bin/sh -e

if [ -v $APP ]
then
  APP=MyApp
fi
echo "Creating" `echo $APP`

echo "Remove old app"
rm -rf dist/`echo $APP`.app

echo "Remove current build path"
rm -rf build

echo "Generate static files"
ember build --environment=production --output-path=build/

echo "Copy static files to build"
cp package.json main.js build

echo "Create .env file"
echo "mode=production" > "build/.env"

echo "Build package using electron-packager"
electron-packager build `echo $APP` --out=dist/ --app-version=0.25.1 --icon=assets/icon.icns --prune

echo "Copy assets"
cp -a assets/. dist/`echo $APP`.app/Contents/Resources/app/assets

echo "Remove build path"
rm -rf build

echo dist/`echo $APP`.app "has been created"