# Simrail Community EDR Changelog

## *V2 - Unreleased*

---

### Important changes

- Backend rewrite which replaces the official EDR website scraper with the official API
- Infrastructure (hosting) has been completely changed
- Full server timetable refreshes every day at 03:00 based on EN1 (for now)
- Add support for Grodzisk Mazowiecki

### Additional changes and enhancements

- Dispatch posts have new and optimized images on the selection screen
- Train pictures have been optimized
- EDR view has a new button for trains that switches to their respective driver view
- EDR view now shows direction of each train based on dispatcher's perspective (and the dispatcher monitor in-game)
- EDR view has better information on whether the train has passed the station
- Changed Chinese & Polish community badges
- Driver view now shows stops (and their type)
- Multiple visual enhancements to driver view
- Train list for driver view is now grouped and sorted

### Fixes

- Popup windows (modals) had their close button hidden on certain monitor sizes
- Several pathfinding issues have been fixed
- Added missing EP08 picture
- Temporarily removed max speed for trains on EDR view as the data was simply wrong
- Timezone display was missing correct number signs
- Driver view now omits repeated speed limit signs
- Driver view had sorting problems when a train was in service during midnight
- In certain cases the dispatch post list could crash
- Fixed timezone could be incorrect in certain areas with DST changes
