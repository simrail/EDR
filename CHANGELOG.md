# Simrail Community EDR Changelog

## *2.7 - 2025-05-18*

### Changes and features

- Added support for Gałkówek, Koluszki, Łódź Widzew, Płyćwia, Rogów, Skierniewice, Warszawa Włochy, Żakowice Południowe, Żyrardów
- Added image support for new train liveries & dispatch posts
- Improved day wrap-around for train running close to midnight (thanks @HakierGrzonzo)

### Other

- Please note that dispatch posts that control multiple points on the map currently only show their own timetable
- Former Simrail CN link changed to Simrail Asia

## *2.6 - 2025-01-12*

### Changes and features

- Added EDR support for Kraków Batowice, Kraków Przedmieście, Miechów, Niedźwiedź, Raciborowice, Słomniki, Zastów, Starzyny (thanks for your help Matejzon)
- Added image support for new train variants as well as the new dispatch posts

### Other

- Please note that dispatch posts that control multiple points on the map currently only show their own timetable (e.g. Olszamowice)
- FR translation was updated

## *2.5 - 2024-05-05*

### Changes and features

- Added EDR support for Łazy ŁB (Łazy), Dąbrowa Górnicza Huta Katowice, Sosnowiec Kazimierz, Bukowno, Tunel, Kozłów, Pruszków (thanks for your help Matejzon)
- Added support for the new ET22 locomotive as well as some missing liveries for existing trains
- Removed the graph button from the EDR view, since the feature is basically broken. It's still accessible via URL query parameter (?graphFullScreenMode=1), but most stations won't work at all.

### Fixes

- Fixed™ the timezone issue, hopefully for real this time
- The map provider selector is no longer covered by the timeline on the driver view

### Other

- Simrail.me was removed from map provider list as it no longer exists
- Technical dependencies were upgraded (housekeeping)
- SimrailFR link was changed (again) to the original Discord invite
- Some thumbnail pictures were replaced, vehicle pictures are now JPEGs too (smaller and faster loading) - thanks Matejzon
- German, Italian and Norwegian translations were updated - thanks to the contributors!

## *2.4 - 2023-11-26*

### Changes and features

- Added support for Sławków, Łazy Ła, Dąbrowa Górnicza Ząbkowice dispatch stations (thanks for your help Matejzon)
- Added support for new trains & liveries
- The train list for driver view is now a little bit easier to understand
- Small changes to driver view for a more mobile-friendly interface (train details are now on a new tab beside the timeline)

### Fixes

- Fixed infinite loading when driver view is selected on an offline train
- Fixed speed restrictions missing on driver view (please remember that these only contain line speeds and not include temporary limits)
- Fixed 'To line' sometimes displaying wrong line number on EDR view
- Fixed background image for resolutions > FullHD
- Fixed rare timezone issue when server time is not in the same daylight savings date as the browser
- Fixed some trains missing from driver view select (Thanks @FrozenTux !)

### Other

- Reverted FR Discord link to the previous link
- Added very simple guide for self-hosting intended for people with some programming knowledge
- Added OSRM server to the repo

## *2.3 - 2023-05-21*

### Important changes

- Support for the latest Simrail update released on 2023.05.17 (timetable & new dispatch posts)
- The ETA estimation that was beside the next station for a train has been removed as it was severely inaccurate and therefore completely useless
- The arrival time column has been changed so that it no longer shows the minutes left (in real time) until scheduled arrival. Instead it now shows actual live delay / earliness of the train. This is very similar to how real-world timetables work. The current implementation uses local logic for calculations which means that this data will be empty on page load and will get gradually updated as trains progress through their timetable. It is not dependent on the official EDR data.
- The backend has been upgraded to use a much more accurate distance calculation method. For those curious, this uses a modified OSRM server that serves as a train route calculator. Unfortunately ETA calculations are currently all over the place (which is why they were removed from the UI and will not be displayed for the forseeable future)
- Support added for switching between map providers (two of them for now: <https://map.simrail.app> and <https://simrail.me>)

### Changes and features

- The realtime clock on the top is now synchronized with the game server
- The driver view got a table header for the timetable part so it's easier to understand the information presented

### Fixes

- The EDR view has been changed to use better spacing so it shouldn't jump around so much anymore
- The driver view also got better spacing
- The driver view now shows all checkpoints and stops instead of only major stations
- Pathfinding fixed for several stations
- Graph load errors fixed for several dispatch stations
- Lots of optimizations and fixes
- Add missing EU flag on server select screen

### Known issues

- Unfortunately the graph view is in a very sorry state and it needs a complete rewrite in order for it to function properly again. Contributions are welcome!
- The driver view doesn't display line speed limits even if it's toggled on

## *2.2 - 2023-04-08*

### Changes and features

- Add support for Norwegian and Spanish languages
- Add proper support for Juliusz & Szeligi

### Fixes

- TCE trains were listed as 'Other' instead of cargo
- Optimizations and small fixes

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
