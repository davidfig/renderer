/*
    renderer.js <https://github.com/davidfig/renderer>
    License: MIT license <https://github.com/davidfig/update/license>
    Author: David Figatner
    Copyright (c) 2016 YOPEY YOPEY LLC
*/ ;(function(){

// renderer wrapper for pixi.js
// options {}
//      noWebGL: use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer
//      div: place renderer in this div
//      aspectRatio: resizing will maintain aspect ratio by ensuring that the smaller dimension fits
//      autoresize: false (default) or true - automatically calls resize during resize event
//      color: background color in hex (0xffffff)
//      antialias: true (default) or false - if native antialias is not used, uses FXAA
//      forceFXAA: false (default) or true - forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great
//      resolution: 1 (default) - resolution / device pixel ratio of the renderer (e.g., retina is 2)
//      clearBeforeRender: true (default) or false - sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`.
//      preserveDrawingBuffer: false (default) or true - enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context.
//      roundPixels: false (default) or true - If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation
//      debug: show debug panels
//      panel: name for debug panel
//      side: side for debug panel: 'bottomRight' (default), 'bottomLeft', 'topLeft', or 'topRight'
function Renderer(options)
{
    options = options || {};
    this.div = options.div;
    if (!this.div)
    {
        this.div = document.createElement('div');
        document.body.appendChild(this.div);
        this.div.style.position = 'absolute';
        this.div.style.width = this.div.style.height = '100%';
        this.div.style.left = this.div.style.top = '0';
        this.div.style.overflow = 'auto';
    }
    this.stage = new PIXI.Container();
    var noWebGL = options.noWebGL || false;
    options.noWebGL = null;
    this.autoResize = options.autoresize;
    options.autoresize = null;
    var Renderer = noWebGL ? PIXI.CanvasRenderer : PIXI.WebGLRenderer;
    this.aspectRatio = options.aspectRatio;
    options.transparent = true;
    this.renderer = new Renderer(0, 0, options);
    this.div.appendChild(this.renderer.view);
    this.div.style.backgroundColor = options.color;
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
    Update.add(this.update.bind(this), null, {percent: options.debug || 'PIXI'});
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
    if (this.debug)
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
        this.dirty = false;
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
    this.div.style.backgroundColor = color;
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
    var width = this.div.offsetWidth;
    var height = this.div.offsetHeight;
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
        this.renderer.resize(this.width, this.height);
        this.landscape = this.width > this.height;
        // this.renderer.view.style.position = 'absolute';
        // this.offset.x = this.div.offsetWidth / 2 - width / 2;
        // this.offset.y = this.div.offsetHeight / 2 - height / 2;
        // this.renderer.view.style.left = this.offset.x + 'px';
        // this.renderer.view.style.top = this.offset.y + 'px';
        this.dirty = true;
    }
};

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
}   })();