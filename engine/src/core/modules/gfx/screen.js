// Screen: The screen manager, for compositing buffers
// Copyright (C) 2014 J.R. Omahen

FABLER.add("Screen", (function () {
    "use strict";

    // Attributes
    var screens = {}, // is an array better here?
    // This object will hold information for a screen
        ScreenBuffer = function (props) {
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

        printDescription: function (text, destScreen) {
            console.log(text + destScreen);
        }
    };
}()));
