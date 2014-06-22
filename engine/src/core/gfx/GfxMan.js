// GfxMan: The Graphics Manager for Fabler
// Copyright (C) 2014 J. R. Omahen

FABLER.GfxMan = (function () {
    "use strict";

    // Attributes
    var canvas, gfxContext, canvasId = 'mainBuffer';

    // Private Methods
    function createCanvas(height, width) {
        if (canvas === undefined) {
            var body = document.getElementsByTagName('body')[0];

            canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.height = height;
            canvas.width = width;

            body.appendChild(canvas);
        }
    }

    function initGfxContext() {
        if (gfxContext === undefined) {
            gfxContext = canvas.getContext('2d');
        }
    }

    // Public Methods
    return {

        init: function () {
            createCanvas(800, 600);
            initGfxContext();
        }

    };
}());
