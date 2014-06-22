// Game: The main object for the library
// This defines the FABLER global object,
// and must be loaded prior to other modules
// Copyright (C) 2014 J.R. Omahen

var FABLER = (function () {
    "use strict";

    // Attributes
    var that = this;
    this.version = '0.0.0.1'; // The current release

    return {
	// Public methods
	getVersion: function () {
	    return that.version;
	},
	
	// Attaches a new member module
	add: function (name, module) {
	    that[name] = module;
	}
    };
}());
