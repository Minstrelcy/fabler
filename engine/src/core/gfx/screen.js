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
	}
    }
}()));
