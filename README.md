# Simrail Community - EDR

## Enhanced timetable experience for Simrail dispatch posts

The project aims to provide a better, easier to understand and modern timetable experience for dispatchers compared to the official built-in timetable in the game. Created by [@DKFN](https://github.com/DKFN). Currently maintained by [@Tallyrald](https://github.com/Tallyrald)

### ➡️➡️➡️[The app is available right here.](https://edr.simrail.app/)⬅️⬅️⬅️

Main features include but are not limited to:

- Live delay / early estimations
- Live distance from dispatch post and current next station for trains
- Search for multiple train numbers at once
- Multi-timetable posts merged into a single row for better and faster decision-making
- Several pre-configured train filters for easy overview
- Driver mode with checkpoint / station list and map integration
- UI available in multiple languages
- Light / dark mode

## Issues, bugs, feature requests

Found any bugs or have new ideas? [Open a new issue](https://github.com/simrail/EDR/issues/new)!

## Contributing

If you feel like contributing, please take a look at [current issues](https://github.com/simrail/EDR/issues). Feel free to submit a PR!

### Release cycle and branches

- Starting from 1.0 each version is published on its own branch
- The master branch is the development branch and it contains the latest changes since the last release
- Hotfixes should be pushed to the respective release branch and later merged into the main branch

## Reusing part of the code

You are welcome to use part or all the code for your own projects. But we kindly ask you to follow these rules:

- State somewhere that part of the code uses this project's code
- If you bring significant enhancements to the code, share it with us (either via DM / PR or an issue) and/or the SimRail modding community
- If you directly use the API, don't be reckless in the amount of requests made

Of course, we will not send lawyers to your house if you don't follow these rules, we are all having fun with our favorite train game :)

## Localization

Translations are happening via [Transifex](https://explore.transifex.com/simrail-community/edr/). If you wish to participate, we ask that you first contact [@Tallyrald](https://github.com/Tallyrald) via email or on the [Simrail forums](https://forum.simrail.eu/profile/782-crypter-emerald/).

## Self Hosting

This is a very basic guide, more details may be added later if needed.

1. Clone this repo
2. Download and install Docker Desktop (or equivalent for your OS)
3. Edit config and API files and replace URLs to match your system (backend, frontend, nginx)
4. Create and run docker images (backend, nginx, osrm), remember to forward ports specified in Dockerfiles and add envvars to backend when running (LISTEN_PORT, STEAM_API_KEY)

## Thank you

A big thank you to the game developers for making [Simrail](https://store.steampowered.com/app/1422130/SimRail__The_Railway_Simulator/) and providing the necessary data for this app to work.

Anorther big thanks to all the SimRail community that has made this project grow way beyond my wildest expectations!

## License

GNU General Public License v3.0
