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
                    }
                    if (typeof method === 'function') {
                        that[name][methodName] = method;
                    } else {
                        throw ({
                            name: "InvalidFunctionException",
                            message: "Someone tried to publish " +
                                "a property with the name " + methodName
                        });
                    } //end if function
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
                    if (modules[name].hasOwnProperty('doSetup')) {
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
