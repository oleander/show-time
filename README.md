# ShowTime

A desktop client for [Trakt.tv](http://trakt.tv) with live updates from [thepiratebay.org](http://thepiratebay.se/) which integrates nicely with [Popcorn-Time](http://popcorntime.io/).

## Screenshots

![Login Screen](resources/login.png)

![Dashboard](resources/dashboard.png)

## Functionality

- Runs in the menu bar and notifies you about new releases
- Play episodes directly in [Popcorn-Time](http://popcorntime.io/)
- Mark seen episodes

## Pre-compiled binaries

Visit the [release page](https://github.com/oleander/git-fame-rb/releases) for pre-compiled binaries.

## Development

1. Insert your own trakt.tv credentials into `config.copy.json` and copy it to `config.json`. You'll find your credentials [on your settings page](http://trakt.tv/oauth/applications).
2. Install all dependencies
3. Start ember using `ember server`
4. Start Electron using `./start`

## Deploy

Run `./deploy` to create a runnable binary. Note that it only support OS X at the moment, but PR are welcome.