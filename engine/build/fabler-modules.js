// GfxMan: The Graphicps Manager for Fabler
// Copyright (C) 2014 J.R. Omahen

FABLER.add("GfxMan",  (function () {
    "use strict";

    // Attributes
    var canvas, gfxContext, 
	// Preferences for the look and feel
	prefs = {
	    textBaseline: 'middle',
	    fontSpec: 'monospace',
	    lines: 20, //lines per screen
	    padding: 0.6, // range of 1-10
	    margin: 2 // absolute
	},
	// Internal representation of the canvas
	buffer = {
	    width: 0,
	    height: 0,
	    bgColour: 'rgb(0, 0, 0)',
	    fgColour: 'rgb(252, 175, 62)',
	    fontScale: 0
	},
	canvasId = 'mainBuffer',
	isFullScreen = false;

    // Private Methods
    function createCanvas(width, height) {
        if (canvas === undefined) {
            var body = document.getElementsByTagName('body')[0];

            canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.height = height;
            canvas.width = width;

	    if (isFullScreen === true) {		
		// Init canvas to window size
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;

		// Setup event handler for the canvas to always be scaled 
		window.addEventListener('resize', function () {
		    canvas.height = window.innerHeight;
		    canvas.width = window.innerWidth;
		});
	    }

	    buffer.width = canvas.width;
	    buffer.height = canvas.height;
	    
            body.appendChild(canvas);
        }
    }

    function initGfxContext() {
        if (gfxContext === undefined) {
            gfxContext = canvas.getContext('2d');
        }
    }

    function clearScreen() {
	gfxContext.fillRect(0, 0, 
			    buffer.width, buffer.height);
    }

    // Public Methods
    return {

        init: function () {
	    // Publish API methods
	    if (this.publish) {
		this.publish('getFullScreen', function () {
		    return isFullScreen;
		});

		this.publish('setFullScreen', this.setIsFullScreen);
	    }
        },

	doSetup: function () {
	    createCanvas(800, 600);
	    initGfxContext();

	    buffer.fontScale =
		Math.floor(buffer.height / prefs.lines);

	    gfxContext.fillStyle = buffer.bgColour;
	    gfxContext.strokeStyle = buffer.fgColour;
	    gfxContext.textBaseline = prefs.textBaseline;
	    gfxContext.font = buffer.fontScale + 
		'px ' + prefs.fontSpec;
	},

	clear: clearScreen,

	drawText: function (sourceText, destX, destY) {
	    var realX = Math.floor(destX) + 
		    Math.floor(buffer.fontScale *  
			       prefs.padding) +
		    prefs.margin, 

		realY = Math.floor(destY) +
		    Math.floor(buffer.fontScale * 
			       prefs.padding) +
		    prefs.margin,
	    // save and restore
		oldFill = gfxContext.fillStyle;

	    gfxContext.fillStyle = buffer.fgColour;
	    gfxContext.fillText(sourceText,
				  realX,
				  realY);
	    gfxContext.fillStyle = oldFill;
	},

	setIsFullScreen: function (setting) {
	    if (typeof setting === 'boolean') {
		isFullScreen = setting;
	    } else {
		// We need to parse the input
		if (typeof setting === 'string') {
		    switch (setting.toLower()) {
			case 'true': 
			isFullScreen = true;
			break;
			case 'false':
			isFullScreen = false;
			break;
			default: 
			throw ({
			    name: "MalformedParameter",
			    message: "Expected 'true' or 'false', not " + setting
			});
		    } 
		} else {
		    setting = Boolean.valueOf(setting);
		}
	    }
	}	
    };
}()));

// Screen: The screen manager, for compositing buffers
// Copyright (C) 2014 J.R. Omahen

FABLER.add("Screen", (function () {
    "use strict";

    // Attributes
    var screens = {}; // is an array better here?
    // Private Methods

    // This object will hold information for a screen
    var ScreenBuffer = function (props) {
	this.name = props.name || '';
	this.buffer = props.buffer || null;
	this.active = props.active || false;
	this.cursor = { //Simple point, middle of line
	    x: 0,
	    y: 0
	};
    };
    
    return {
    // Public Methods
	createScreen: function (name, buffer, active) {
	    screens[name] = new ScreenBuffer({
		'name': name,
		'buffer': buffer,
		'active': active
	    });

	    return screens[name];
	},
	
	printDescription: function(text, destScreen) {
	}
    };
}()));

function Player(position, stats)
{
	this.position = position;
	this.stats = stats;
};
/* Idea is to have an array called locations that will contain all the actual world information */

var locations = {
	alleyEntrance: {
		name: "Entrance to Diagon Alley",
		description: "This is the entrance to Diagon Alley.",
		on_enter: function() {
			console.log("You are now entering Diagon Alley.");
		},
		objects: {
			alley: {
				name: "alley",
				description: "You see Diagon Alley before you.",
			}
		},
		exits: {
			north: {
				direction: "north",
				room: "alley1",
			},
		},
	},

	alley1: {
		name: "Farther along Diagon Alley",
		description: "Farther along Diagon Alley",
		exits: {
			south: {
				direction: "south",
				room: "alleyEntrance",
			},
		},
	},
};

// This file should load locations.js

function world(locations)
{
	this.locations = locations;
	for (var i = 0; i < locations.length; i++) {
		// create rooms for each location in locations.js here
	};
}