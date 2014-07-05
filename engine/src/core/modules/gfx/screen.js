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

        printDescription: function (text) {
            var textBuffer = {
                contents: [text],
                x: 0,
                y: 0
            },
                tempBuffer,
                i,
                lineHeight = this.modules.GfxMan.getBuffer().metrics.width * 2;

            // Wrap text if needed, building a textBuffer series
            if (text.length > this.modules.GfxMan.getMaxChars()) {
                tempBuffer = text;
                textBuffer.contents = [];

                while (tempBuffer.length > this.modules.GfxMan.getMaxChars()) {
                    textBuffer.contents.push(tempBuffer.
                              substr(0,
                                     this.modules.GfxMan.getMaxChars() - 1)
                             );

                    tempBuffer = tempBuffer.substr(
                        this.modules.GfxMan.getMaxChars() - 1
                    );
                }

                textBuffer.contents.push(tempBuffer);

                // Now iterate, advancing each text line
                // by the line height
                for (i = 0; i < textBuffer.contents.length; i += 1) {
                    this.modules.GfxMan.drawText(textBuffer.contents[i],
                                                 textBuffer.x,
                                                 (textBuffer.y +
                                                  (i * lineHeight)));
                }
            } else {
                // No need to wrap the text; render it normal
                this.modules.GfxMan.drawText(textBuffer.contents[0],
                                            textBuffer.x,
                                            textBuffer.y);
            }
        }
    };
}()));
