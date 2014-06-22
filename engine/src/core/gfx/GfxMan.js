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
		canvas.mozRequestFullScreen();
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
            createCanvas(800, 600);
            initGfxContext();
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
			isFulScreen = false;
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
