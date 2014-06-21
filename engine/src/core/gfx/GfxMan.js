// GfxMan: The Graphics Manager for Fabler
// Copyright (C) 2014 J. R. Omahen

var GfxMan = (function (){
    // Attributes
    var _canvas;
    var _canvasId = 'mainBuffer';
    var _gfxContext;

    // Private Methods
    function _createCanvas(height, width) {
	if (typeof _canvas === 'undefined') {
	    var body = document.getElementsByTagName('body')[0];

	    _canvas = document.createElement('canvas');
	    _canvas.id = _canvasId;
	    _canvas.height = height;
	    _canvas.width = width;

	    body.appendChild(_canvas);
	}
    };

    function _initGfxContext() {
	if (typeof _gfxContext === 'undefined') {
	    _gfxContext = _canvas.getContext('2d');
	}
    };

    // Public Methods
    return {

	init: function () {
	    _createCanvas(800, 600);
	    _initGfxContext();
	}

    };
}());
