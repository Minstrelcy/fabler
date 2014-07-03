// This file should load locations.js

function World(locations) {
    'use strict';
    var i;

    this.locations = locations;

    for (i = 0; i < locations.length; i += 1) {
        // create rooms for each location in locations.js here
        locations[i].init();
    }
}
