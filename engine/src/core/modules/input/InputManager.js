// InputManager: The input manager for Fabler
// Copyright (C) 2015 J.R. Omahen

FABLER.add("InputMan", (function () {
    "use strict";

    // Internal structure to store input as it comes in
    var currentIndex = 0,
        buffer = [];

    // Internal methods
    function keyListener(event) {
        var keyCode = event.charCode,
            keyChar = String.fromCharCode(keyCode);

        buffer[currentIndex] = keyChar;

        currentIndex += 1;
    }

    return {
        init: function () {
            if (this.publish) {
                this.publish('getBuffer', function () {
                    return buffer;
                });
            }
        },

        doSetup: function () {
            // Set up an event listener to capture keystrokes
            document.addEventListener('keypress', keyListener);
        }
    };
}()));
