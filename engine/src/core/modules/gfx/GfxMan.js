// GfxMan: The Graphicps Manager for Fabler
// Copyright (C) 2014 J.R. Omahen

FABLER.add("GfxMan",  (function () {
    "use strict";

    // Attributes
    var canvas, gfxContext,

        // Preferences for the look and feel
        prefs = {
            textBaseline: 'middle',
            fontSpec: 'monospace',
            lines: 20 //lines per screen
        },

        // Internal representation of the canvas
        // calculated with updateMetrics
        buffer = {
            width: 0,
            height: 0,
            bgColour: 'rgb(0, 0, 0)',
            fgColour: 'rgb(252, 175, 62)',
            fontScale: 0,
            maxChars: 0, // How much text can be written per line
            metrics: null, // For TextMetrics
            padding: 10 // Space around the main screen area
        },
        canvasId = 'mainBuffer',
        isFullScreen = false;

    // Private Methods
    function updateMetrics() {
        var height = Math.floor(canvas.height),
            width = Math.floor(canvas.width);

        // Setup the buffer stats
        buffer.height = height - buffer.padding;
        buffer.width = width - buffer.padding;
        buffer.fontScale = Math.floor(buffer.height / prefs.lines);

        // Setup context specs
        gfxContext.font = buffer.fontScale +
            'px ' + prefs.fontSpec;

        // Calculate text metrics
        buffer.metrics = gfxContext.measureText('m');
        buffer.metrics.emHeightAscent = Math.floor(buffer.metrics.width * 2);
        buffer.maxChars = Math.floor(buffer.width / buffer.metrics.width);
    }

    function createCanvas(width, height) {
        if (canvas === undefined) {
            var body = document.getElementsByTagName('body')[0];

            canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.height = height;
            canvas.width = width;

            if (isFullScreen === true) {
                // Init canvas to window size
                canvas.height = window.innerHeight;
                canvas.width = window.innerWidth;

                // Setup event handler for the canvas to always be scaled
                window.addEventListener('resize', function () {
                    canvas.height = window.innerHeight;
                    canvas.width = window.innerWidth;

                    // Make sure the metrics are updated
                    updateMetrics();
                });
            }

            buffer.width = canvas.width;
            buffer.height = canvas.height;

            body.appendChild(canvas);
        }
    }

    function initGfxContext() {
        if (gfxContext === undefined) {
            gfxContext = canvas.getContext('2d');
        }
    }

    function clearScreen() {
        gfxContext.fillRect(0, 0,
                            buffer.width, buffer.height);
    }

    // Public Methods
    return {

        init: function () {
            // Publish API methods
            if (this.publish) {
                this.publish('getFullScreen', function () {
                    return isFullScreen;
                });

                this.publish('setFullScreen', this.setIsFullScreen);
            }
        },

        doSetup: function () {
            createCanvas(800, 600);
            initGfxContext();

            gfxContext.fillStyle = buffer.bgColour;
            gfxContext.strokeStyle = buffer.fgColour;
            gfxContext.textBaseline = prefs.textBaseline;

            updateMetrics(); // Make sure scaling is right
        },

        clear: clearScreen,

        drawText: function (sourceText, destX, destY) {
            var realX = Math.floor(destX + buffer.metrics.width +
                                   buffer.padding),
                realY = Math.floor(destY + buffer.metrics.emHeightAscent +
                                  buffer.padding),
                // save and restore
                oldFill = gfxContext.fillStyle;

            gfxContext.fillStyle = buffer.fgColour;
            gfxContext.fillText(sourceText,
                                  realX,
                                  realY);
            gfxContext.fillStyle = oldFill;
        },

        // Draw a text buffer of the form:
        //var textBuffer = {
        //    contents: [text],
        //    x: 0,
        //    y: 0
        //}
        // The text needs to be wrapped as needed
        drawTextBuffer: function (textBuffer) {
            var printBuffer = new this.modules.Screen.TextBuffer(),
                tempBuffer = '',
                spliceArray = [],
                i,
                j;

            if (typeof textBuffer === 'string') {
                return; // Not the right method
            }

            printBuffer.x = textBuffer.x;
            printBuffer.y = textBuffer.y;

            // We need to iterate over the text buffer's 
            // members, splicing into the array additional
            // lines where we need to wrap
            for (i = 0; i < textBuffer.contents.length; i += 1) {
                // Wrap text if needed, building a textBuffer series
                if (textBuffer.contents[i].length > buffer.maxChars) {
                    tempBuffer = textBuffer.contents[i];
                    spliceArray = [];

                    while (tempBuffer.length > buffer.maxChars) {
                        spliceArray.push(tempBuffer.substr(0,
                                                           buffer.maxChars - 1));

                        tempBuffer = tempBuffer.substr(buffer.maxChars - 1);
                    }

                    spliceArray.push(tempBuffer);

                    // Copy into the print buffer
                    for (j = 0; j < spliceArray.length; j += 1) {
                        printBuffer.contents.push(spliceArray[j]);
                    }
                    // Add in the newly-divided text in place of the old.
                    // I hate manual merging, but c'est la vie.
                    //textBuffer.contents.splice(i, 1);

                    //for (j = 0; j < spliceArray.length; j += 1) {
                    //    textBuffer.contents.splice(i + j, 0, spliceArray[j]);
                    //}

                    //i = j; // Advance the iterator past 
                } else {
                    // No wrapping needed
                    printBuffer.contents.push(textBuffer.contents[i]);
                }
            }

            // Now iterate, advancing each text line
            // by the line height
            for (i = 0; i < printBuffer.contents.length; i += 1) {
                this.drawText(printBuffer.contents[i],
                                             printBuffer.x,
                                             (printBuffer.y +
                                              (i * buffer.metrics.emHeightAscent)
                                             ));
            }

            this.modules.Screen.moveCursor((printBuffer.x +
                                            (printBuffer.contents[i - 1].length *
                                            buffer.metrics.width)),
                                          (printBuffer.y +
                                           ((i - 1) *
                                            buffer.metrics.emHeightAscent)));
        },

        // Rectangle clearing
        clearRect: function (rect) {
            var offsetX = buffer.metrics.width + buffer.padding,
                offsetY = buffer.metrics.emHeightAscent + buffer.padding;

            gfxContext.clearRect(rect.x + offsetX,
                                rect.y + offsetY,
                                rect.dx,
                                rect.dy);
        },

        // Draws a rectangle filled with the 
        // currently described foreground colour.
        drawRect: function (rect) {
            var oldFill = gfxContext.fillStyle,
                offsetX = buffer.metrics.width + buffer.padding,
                offsetY = buffer.metrics.emHeightAscent + buffer.padding;

            gfxContext.fillStyle = buffer.fgColour;

            gfxContext.fillRect(rect.x + offsetX,
                                rect.y + offsetY,
                                rect.dx,
                                rect.dy);

            gfxContext.fillStyle = oldFill;
        },

        setIsFullScreen: function (setting) {
            if (typeof setting === 'boolean') {
                isFullScreen = setting;
            } else {
                // We need to parse the input
                if (typeof setting === 'string') {
                    switch (setting.toLower()) {
                    case 'true':
                        isFullScreen = true;
                        break;
                    case 'false':
                        isFullScreen = false;
                        break;
                    default:
                        throw ({
                            name: "MalformedParameter",
                            message: "Expected 'true' or 'false', not " + setting
                        });
                    }
                } else {
                    setting = Boolean.valueOf(setting);
                }
            }
        },

        getBuffer: function () {
            return buffer;
        },

        getMaxChars: function () {
            return buffer.maxChars;
        }
    };
}()));
