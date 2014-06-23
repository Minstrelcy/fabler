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
	    Asset: false
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
		module.publish = function (name, method) {
		    if (that.hasOwnProperty(name)) {
			throw ({
			    name: "DuplicatePropertyException",
			    message: "This object already has a " + 
				"property with the name " + name
			});
		    } else {
			if (typeof method === 'function') {
			    that[name] = method;
			} else {
			    throw ({
				name: "InvalidFunctionException",
				message: "Someone tried to publish " + 
				    "a property with the name " + name
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

	run: function () {
	    var i;

	    for (i = 0; i < modules.length; i += 1) {
		modules[i].doSetup();
	    }
	}
    };
}());
