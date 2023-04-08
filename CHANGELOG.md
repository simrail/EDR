# Simrail Community EDR Changelog

## *2.1 - 2023-04-08*

### Changes and features

- The train list now shows players driving
- The driver view received a toggle which turns on/off the speed limits
- The driver view now shows when a player is dispatching one of the stations
- The EDR view now shows the next station for a train instead of guessing the nearest one
- The EDR view now tries to predict when a train will arrive (for trains within ~20 mins) based on it's location, timetable and speed instead of only the speed - This should be much more accurate for most situations, but of course it's not perfect
- The EDR view now shows a green indicator for trains approaching the station
- Changed some train direction indicators on the EDR view for Knapówka & Włoszczowa Północ
- The language selector has been alphabetically sorted and now uses native words for supported languages
- Added support for 3 (probably) upcoming dispatch posts: Łazy, Łazy Ła & Dąbrowa Górnicza Ząbkowice
- Added support for upcoming train (service) types

### Fixes

- Some dispatch stations showed their timezone with a double negative sign
- The graph view now opens directly in a new window instead of the non-functional Modal (pop-up)
- Fixed several situations where the EDR view could fail to load
- Fixed background image stretching to infinity if the page is long enough
- Fixed Stop column display for multi-timetable posts (Sosnowiec Główny)
- Fixed missing pictures for some trains due to the game update on 2023-04-07
- Fixed train notification icon appearing for offline trains

## *2.0 - 2023-03-27*

### Important changes

- Backend rewrite which replaces the official EDR website scraper with the official API
- Infrastructure (hosting) has been completely changed
- Full server timetable refreshes every day at 04:00 (Warsaw time) based on EN1 (for now)
- Add support for Grodzisk Mazowiecki and upcoming dispatch posts

### Additional changes and enhancements

- Dispatch posts have new and optimized images on the selection screen and they are alphabetically sorted
- Train pictures have been optimized
- EDR view has a new button for trains that switches to their respective driver view
- EDR view now shows direction of each train based on dispatcher's perspective (and the dispatcher monitor in-game)
- EDR view has better information on whether the train has passed the station
- Changed Chinese, Polish and German community badges
- Driver view now shows stops (and their type)
- Multiple visual enhancements to driver view
- Train list for driver view is now grouped and sorted by train number
- Romanian language is now supported

### Fixes

- Popup windows (modals) had their close button hidden on certain monitor sizes
- Several pathfinding issues have been fixed
- Added missing EP08 picture
- Temporarily removed max speed for trains on EDR view as the data was simply wrong
- Timezone display was missing correct number signs
- Driver view now omits repeated speed limit signs
- Driver view had sorting problems when a train was in service during midnight
- In certain cases the dispatch post list could crash
- Fixed timezone could be incorrect in certain areas with DST
