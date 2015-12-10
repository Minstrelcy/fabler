// Screen: The screen manager, for compositing buffers
// Copyright (C) 2014 J.R. Omahen

FABLER.add("Screen", (function () {
    "use strict";

    // Attributes
    var screens = {}, // is an array better here?
    // This object will hold information for a screen
        ScreenBuffer = function (props, screenObj) {
            var that = screenObj;
            this.name = props.name || '';
            this.buffer = props.buffer || null;
            this.prompt = props.prompt || null;
            this.active = props.active || false;
            this.appendBuffer = ""; // For text replacement
            this.cursor = { //Simple point, middle of line
                frameIndex: 0,
                x: 0,
                y: 0,
                visible: true,

                // The dimensions of the cursor
                rect: {
                    x: 0,
                    y: 0,
                    dx: 0,
                    dy: 0
                },

                clear: function () {
                    that.modules.GfxMan.clearRect(this.rect);
                },

                // Simple method for drawing the cursor
                draw: function () {
                    if (this.visible) {
                        that.modules.GfxMan.drawRect(this.rect);
                    }
                },

                // Move the cursor to a new pos, recalculating
                // the bounding box
                moveTo: function (x, y) {
                    var charWidth =
                            that.modules.GfxMan.getBuffer().metrics.width,
                        charHeight =
                            that.modules.GfxMan.getBuffer().metrics.
                            emHeightAscent;

                    // Remove the cursor from its current pos
                    this.clear();

                    this.x = Math.floor(x);
                    this.y = Math.floor(y);
                    this.rect.x = Math.floor(x);
                    this.rect.y = Math.floor(y - (charHeight / 2)); //middle base
                    this.rect.dx = Math.floor(charWidth);
                    this.rect.dy = Math.floor(charHeight);
                },

                toggleVisible: function () {
                    this.visible = !this.visible;
                },

                blink: function () {
                    // Animate a blinking cursor
                    var frames = 17;

                    this.frameIndex += 1;

                    if (this.frameIndex === frames) {
                        this.toggleVisible();
                        this.frameIndex = 0;
                    }
                }
            };
        };

    return {
        // Public Methods
        copyBuffer: function (fromBuffer, toBuffer) {
            var j = 0;

            if (fromBuffer.contents.length === 0) {
                return;
            }

            toBuffer.contents.splice(0);

            for (j = 0; j < fromBuffer.contents.length; j += 1) {
                toBuffer.contents.push(fromBuffer.contents[j]);
            }
        },

        createScreen: function (name, active, prompt) {
            screens[name] = new ScreenBuffer({
                'name': name,
                'buffer': new this.TextBuffer(),
                'active': active
            }, this);

            // Setup the user command prompt
            if (typeof prompt === 'string') {
                screens[name].prompt = prompt;
            } else {
                screens[name].prompt = "fabler> ";
            }

            // Setup back buffer
            screens[name].backBuffer = this.TextBuffer();

            screens[name].cursor.moveTo(0, 0);

            return screens[name];
        },

        moveCursor: function (x, y) {
            if (screens.current !== undefined) {
                screens.current.cursor.moveTo(x, y);
            }
        },

        getCursor: function () {
            if (screens.current !== undefined) {
                return {
                    x: screens.current.cursor.x,
                    y: screens.current.cursor.y
                };
            }

            return {};
        },

        printDescription: function (text, screen) {
            if (typeof screen === 'string') {
                screens[screen].buffer.contents.push(text);
            } else {
                screens.current.buffer.contents.push(text);
            }
        },

        printAtEnd: function (text, screen) {
            var curScreen = screens.current;

            if (typeof screen === 'string') {
                curScreen = screens[screen];
            }

            curScreen.appendBuffer = text;
        },

        render: function () {
            if (screens.current.active) {
                this.copyBuffer(screens.current.buffer, screens.current.backBuffer);

                // Insert prompt
                screens.current.backBuffer.contents.push(' ');
                screens.current.backBuffer.contents.push(screens.current.prompt);

                this.modules.GfxMan.drawTextBuffer(screens.current.backBuffer,
                                                   screens.current.appendBuffer);

                screens.current.cursor.blink();
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
