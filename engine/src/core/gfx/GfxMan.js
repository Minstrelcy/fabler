// GfxMan: The Graphics Manager for Fabler
// Copyright (C) 2014 J.R. Omahen

FABLER.add("GfxMan",  (function () {
    "use strict";

    // Attributes
    var canvas, gfxContext, 
	canvasId = 'mainBuffer',
	isFullScreen = false;

    // Private Methods
    function createCanvas(height, width) {
        if (canvas === undefined) {
            var body = document.getElementsByTagName('body')[0];

            canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.height = height;
            canvas.width = width;

	    if (isFullScreen === true) {		
		// Setup event handler for the canvas to always be scaled 
		window.addEventListener('resize', function () {
		    canvas.height = window.innerHeight;
		    canvas.width = window.innerWidth;
		});
	    }
	    
            body.appendChild(canvas);
        }
    }

    function initGfxContext() {
        if (gfxContext === undefined) {
            gfxContext = canvas.getContext('2d');
        }
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
	},

	drawText: function (sourceText, destX, destY) {
	    gfxContext.strokeText({
		text: sourceText,
		x: Math.floor(destX),
		y: Math.floor(destY)
	    });
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
