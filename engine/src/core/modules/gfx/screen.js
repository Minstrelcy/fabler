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
                y: 0,

                // The dimensions of the cursor
                rect: {
                    topX: 0,
                    topY: 0,
                    bottomX: 0,
                    bottomY: 0
                },
                    
                // Simple method for drawing the cursor
                draw: function () {
                    
                }
            };
        };

    return {
        // Public Methods
        createScreen: function (name, active) {
            screens[name] = new ScreenBuffer({
                'name': name,
                'buffer': new this.TextBuffer(),
                'active': active
            });

            return screens[name];
        },

        printDescription: function (text, screen) {
            if (typeof screen === 'string') {
                screens[screen].buffer.contents.push(text);
            } else {
                screens.current.buffer.contents.push(text);
            }
        },

        render: function () {
            if (screens.current.active) {
                this.modules.GfxMan.drawTextBuffer(screens.current.buffer);
                screens.current.cursor.draw();
            }
        },

        switchScreen: function (name) {
            if (screens.hasOwnProperty(name)) {
                screens.current = screens[name];
            }
        },

        // Constructor for a TextBuffer:
        //var textBuffer = {
        //    contents: [text],
        //    x: 0,
        //    y: 0
        //}
        TextBuffer: function (text) {
            this.contents = [];

            if (typeof text === 'string') {
                this.contents.push(text);
            }

            this.x = 0;
            this.y = 0;

            return this;
        }
    };
}()));
