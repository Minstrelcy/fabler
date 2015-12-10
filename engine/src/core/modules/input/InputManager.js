// InputManager: The input manager for Fabler
// Copyright (C) 2015 J.R. Omahen

FABLER.add("InputMan", (function () {
    "use strict";

    // Internal structure to store input as it comes in
    var buffer = [],
        bufferImpl,

        // Internal buffer object
        InputBuffer = function (inputObj) {
            var that = inputObj;


            this.init = function () {
                // Check for the 'key' property
                // Set up an event listener to capture keystrokes
                document.addEventListener('keypress', function (event) {
                    var keyCode = event.key;

                    // Check for command processing
                    if ((keyCode === "Enter") ||
                            (keyCode === "Return")) {
                        buffer.splice(0);

                        that.modules.Screen.printAtEnd("");
                        return;
                    }

                    // Check for backspace
                    if (keyCode === "Backspace") {
                        buffer.pop();
                    } else {
                        buffer.push(keyCode);
                    }

                    that.modules.Screen.printAtEnd(buffer.join(""));
                });
            };
        };

    return {
        init: function () {
            if (this.publish) {
                this.publish('getBuffer', function () {
                    return buffer;
                });

                this.publish('flushBuffer', function () {
                    bufferImpl.print();
                });
            }
        },

        doSetup: function () {
            bufferImpl = new InputBuffer(this);
            bufferImpl.init();
        },

        render: function () {
            bufferImpl.print();
        }
    };
}()));
