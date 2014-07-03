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
            metrics: null // For TextMetrics
        },
        canvasId = 'mainBuffer',
        isFullScreen = false;

    // Private Methods
    function updateMetrics() {
        var height = Math.floor(canvas.height),
            width = Math.floor(canvas.width);

        // Setup the buffer stats
        buffer.height = height;
        buffer.width = width;
        buffer.fontScale = Math.floor(height / prefs.lines);

        // Setup context specs
        gfxContext.font = buffer.fontScale +
            'px ' + prefs.fontSpec;

        // Calculate text metrics
        buffer.metrics = gfxContext.measureText('m');
        buffer.metrics.emHeightAscent = Math.floor(buffer.metrics.width);
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
            var realX = Math.floor(destX + buffer.metrics.width),
                realY = Math.floor(destY + buffer.metrics.emHeightAscent),
                // save and restore
                oldFill = gfxContext.fillStyle;

            gfxContext.fillStyle = buffer.fgColour;
            gfxContext.fillText(sourceText,
                                  realX,
                                  realY);
            gfxContext.fillStyle = oldFill;
        },

        drawTextBuffer: function (textBuffer) {
            var oldFill = gfxContext.fillStyle,
                realX,
                realY;

            if (typeof textBuffer === 'string') {
                return;
            }

            realX = Math.floor(textBuffer.x + buffer.metrics.width);
            realY = Math.floor(textBuffer.y + buffer.metrics.emHeightAscent);

            if (textBuffer.fillStyle &&
                    textBuffer.fillStyle !== '') {
                gfxContext.fillStyle = textBuffer.fillStyle;
            }

            gfxContext.fillText(textBuffer.text,
                                realX,
                                realY);

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
        }
    };
}()));
