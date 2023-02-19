![](https://cdn.p33t.net/ZSVOOTMHDA.png)
# Simrail Community - EDR: official desktop version

### Web version of this EDR is available at [edr.simrail.app](https://edr.simrail.app/ "https://edr.simrail.app/")

# Installation
Production versions are available at the [releases](https://github.com/simrail/edr_desktop/releases "releases") page.
If you don't see your os, feel free to build it yourself

# Development
This application is using [Tauri](https://tauri.app/ "Tauri") as a framework. I chose this framework because it's much more lightweight than [Electron](https://www.electronjs.org/ "Electron")
To start up a development version:
- clone the repository
- make sure you have all [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites "prerequisites")
- install packages by using `npm i`
- run the dev version by using `npm run tauri dev`
Please do not change anything related to frontend itself, you can commit it to the [web version](https://github.com/simrail/EDR "web version") and it will get here too

# Todo:
- Splash screen (loading circle when the app is loading)
- Native notifications support
- Auto updater
*Anything more? 🤔 Feel free to suggest anything using [issues](https://github.com/simrail/edr_desktop/issues "issues")*

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
