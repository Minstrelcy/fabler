// Game: The main object for the library
// This defines the FABLER global object,
// and must be loaded prior to other modules
// Copyright (C) 2014 J.R. Omahen

var FABLER = (function () {
    "use strict";

    // Attributes
    var version = '0.0.0.1', // The current release
	// To control API access
	subsystems = {
	    GfxMan: true,
	    Player: true,
	    Location: false,
	    Asset: false,
	    Screen: false
	},

	modules = {};

    return {
	// Public methods
	getVersion: function () {
	    return version;
	},
	
	// Attaches a new member module
	add: function (name, module) {
	    if (typeof modules[name] === 'object') {
		return;
	    }

	    var that = this;
	    modules[name] = module;

	    // Allow front-end systems to publish
	    // to the API
	    if (subsystems[name] === true) {
		this[name] = { }; // Expose a public namespace
		
		module.publish = function (methodName, method) {
		    if (that[name].hasOwnProperty(methodName)) {
			throw ({
			    name: "DuplicatePropertyException",
			    message: "This object already has a " + 
				"property with the name " + methodName
			});
		    } else {
			if (typeof method === 'function') {
			    that[name][methodName] = method;
			} else {
			    throw ({
				name: "InvalidFunctionException",
				message: "Someone tried to publish " + 
				    "a property with the name " + methodName
			    });
			} //end if function
		    } // end if not published
		};
	    }

	    // Fire the init
	    if (module.hasOwnProperty('init')) {
		module.init();
	    }

	},

	load: function () {
	    var name;

	    for (name in modules) {
		if (modules.hasOwnProperty(name)) {
		    if ( modules[name].hasOwnProperty('doSetup')) {
			modules[name].doSetup();
		    }
		}
	    }
	},

	run: function () {
	    modules.GfxMan.clear();
	    modules.GfxMan.drawText('Hello, World!!',
				    0, 
				    0);
	}
    };
}());
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
		oldFill = gfxContext.fillValue;

	    gfxContext.fillValue = buffer.fgColour;
	    gfxContext.strokeText(sourceText,
				  realX,
				  realY);
	    gfxContext.fillValue = oldFill;
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
