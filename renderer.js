/*
    renderer.js <https://github.com/davidfig/renderer>
    License: MIT license <https://github.com/davidfig/update/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/

/**
 * Wrapper for a PIXI.js Renderer
 * @param {object} options
 * @param {boolean=false} options.alwaysRender - update renderer every update tick
 * @param {boolean=false} options.noWebGL - use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer
 * @param {HTMLCanvasElement=null} options.canvas - place renderer in this canvas
 * @param {HTMLElement=document.body} options.parent - if no canvas is provided, use parent to provide parent for generated canvas; otherwise uses document.body
 * @param {number=null} options.aspectRatio - resizing will maintain aspect ratio by ensuring that the smaller dimension fits
 * @param {boolean=false} options.autoresize - automatically calls resize during resize events
 * @param {number=0xffffff} options.color - background color in hex
 * @param {boolean=true} options.antialias - turn on antialias; if native antialias is not used, uses FXAA
 * @param {boolean=false} options.forceFXAA - forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great
 * @param {number=1} options.resolution / device pixel ratio of the renderer (e.g., original retina is 2)
 * @param {boolean=true} options.clearBeforeRender - sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`.
 * @param {boolean=false} options.preserveDrawingBuffer - enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context.
 * @param {boolean=false} options.roundPixels - if true PIXI will Math.floor() x/y values when rendering, stopping pixel interpolation
 * @param {object} options.styles - apply these CSS styles to the div
 * @param {boolean=false} options.debug - show debug panels (uses github.com/davidfig/debug)
 * @param {string} options.panel - name for debug panel
 * @param {string='bottomRight'} options.side for debug panel ('bottomRight', 'bottomLeft', 'topLeft', or 'topRight')
*/
function Renderer(options)
{
    options = options || {};
    this.canvas = options.canvas;
    options.resolution = this.resolution = options.resolution || 1;
    if (!this.canvas)
    {
        this.canvas = document.createElement('canvas');
        if (options.parent)
        {
            options.parent.appendChild(this.canvas);
            options.parent = null;
        }
        else
        {
            document.body.appendChild(this.canvas);
        }
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        var width = w.innerWidth || e.clientWidth || g.clientWidth;
        var height = w.innerHeight|| e.clientHeight|| g.clientHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.width = width * this.resolution;
        this.canvas.height = height * this.resolution;
        this.canvas.style.left = this.canvas.style.top = '0px';
        this.canvas.style.overflow = 'auto';
    }
    this.alwaysRender = options.alwaysRender || false;
    options.view = this.canvas;
    this.stage = new PIXI.Container();
    var noWebGL = options.noWebGL || false;
    options.noWebGL = null;
    this.autoResize = options.autoresize;
    options.autoresize = null;
    var Renderer = noWebGL ? PIXI.CanvasRenderer : PIXI.WebGLRenderer;
    this.aspectRatio = options.aspectRatio;
    if (typeof options.color === 'undefined')
    {
        options.transparent = true;
    }
    options.antialias = (typeof options.antialias === 'undefined') ? true : options.antialias;
    this.renderer = new Renderer(width, height, options);
    document.body.appendChild(this.renderer.view);
    if (options.color)
    {
        this.renderer.backgroundColor = options.color;
    }
    if (options.styles)
    {
        for (var style in options.styles)
        {
            this.canvas.style[style] = options.styles[style];
        }
    }
    this.width = 0;
    this.height = 0;
    this.offset = new PIXI.Point();
    if (options.debug)
    {
        var name = options.panel || 'PIXI';
        this.debug = Debug.add(name, {side: options.side, text: name + ': <span style="background:white">X</span> 0 objects'});
        this.debug.name = name;
    }
    if (options.resize)
    {
        window.addEventListener('resize', this.resize.bind(this));
    }
    Update.add(this.update.bind(this), null, {percent: options.panel || 'PIXI'});
    if (this.autoresize)
    {
        window.addEventListener('resize', this.resize.bind(this));
    }
    this.resize(true);
};


// force an immediate render without checking dirty flag
Renderer.prototype.render = function()
{
    this.renderer.render(this.stage);
};

// render the scene
Renderer.prototype.update = function ()
{
    if (this.debug && this.dirty !== this.last)
    {
        var count = this.countObjects();
        if (this.last !== this.dirty || count !== this.lastCount)
        {
            var color = this.dirty ? 'white' : 'gray';
            debugOne(this.debug.name + ': <span style="background: ' + color + '; color: ' + color + '">X</span> ' + count + ' objects', {panel: this.debug});
            this.last = this.dirty;
            this.lastCount = count;
        }
    }
    if (this.dirty)
    {
        this.render();
        this.dirty = this.alwaysRender;
    }
};

// counts visible objects for debug panel
Renderer.prototype.countObjects = function()
{
    function count(object)
    {
        if (!object.visible)
        {
            return;
        }
        total++;
        for (var i = 0; i < object.children.length; i++)
        {
            count(object.children[i]);
        }
    }
    var total = 0;
    count(this.stage);
    return total;
};

// sets the background color (in CSS format)
Renderer.prototype.background = function(color)
{
    this.canvas.style.backgroundColor = color;
};

// adds object to stage
Renderer.prototype.add = function(object, to)
{
    to = to || this.stage.children.length;
    this.stage.addChildAt(object, to);
    return object;
};

Renderer.prototype.addChild = Renderer.prototype.addChildTo = Renderer.prototype.add;

// remove child from stage
Renderer.prototype.remove = function(object)
{
    this.stage.removeChild(object);
};

// clears stage
Renderer.prototype.clear = function()
{
    this.stage.removeChildren();
};

Renderer.prototype.resize = function(force)
{
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
    var width = w.innerWidth || e.clientWidth || g.clientWidth;
    var height = w.innerHeight|| e.clientHeight|| g.clientHeight;
    if (this.aspectRatio)
    {
        if (width > height)
        {
            width = height * this.aspectRatio;
        }
        else
        {
            height = width / this.aspectRatio;
        }
    }
    if (force || width !== this.width || height !== this.height)
    {
        this.width = width;
        this.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.renderer.resize(this.width, this.height);
        this.landscape = this.width > this.height;
        this.dirty = true;
    }
};

// returns the smaller of the width/height based
Renderer.prototype.dimensionSmall = function()
{
    return (this.landscape ? this.height : this.width);
}

// returns the larger of the width/height based
Renderer.prototype.dimensionBig = function()
{
    return (this.landscape ? this.width : this.height);
}

// add support for AMD (Asynchronous Module Definition) libraries such as require.js.
if (typeof define === 'function' && define.amd)
{
    define(function()
    {
        return {
            Renderer: Renderer
        };
    });
}

// add support for CommonJS libraries such as browserify.
if (typeof exports !== 'undefined')
{
    module.exports = Renderer;
}

// define globally in case AMD is not available or available but not used
if (typeof window !== 'undefined')
{
    window.Renderer = Renderer;
}