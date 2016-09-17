## update.js
update loop API for javascript apps. Works well with https://github.com/davidfig/debug (included for testing and examples)

## Code Example

// debug panel on the bottom right
Debug.init();

// used for automatic rendering
Update.init({debug: Debug});
Animate.init();
Update.update();

// creates the renderer with one option
var resolution = window.devicePixelRatio;
var renderer = new Renderer({autoresize: true, resolution: resolution, debug: Debug, update: Update});
renderer.canvas.style.pointerEvents = 'none';

// set initial position for all triangles
for (var i = 0; i < 100; i++)
{
    var t = triangle(Math.random() * renderer.width * 0.1, Math.random() * 0xffffff);
    t.position.set(Math.random() * renderer.width, Math.random() * renderer.height);
    next;
}
move();
Update.add(move, 6000);

Debug.log('Notice the render light above automatically turns off when the animations stop.');

// animate one triangle with random values
function next(t)
{
    var x = Math.random() * renderer.width;
    var y = Math.random() * renderer.height;
    var scaleX = Math.random() * 3;
    var scaleY = Math.random() * 3;
    var alpha = 0.5 * Math.random();
    var rotation = Math.random() * Math.PI * 2;
    var time = 1000 + Math.random() * 4000;
    Animate.to(t, {alpha: alpha, x: x, y: y, scale: {x: scaleX, y: scaleY}, rotation: rotation}, time, {renderer: renderer}, Easing.easeInOutSine);
}

// animate all objects
function move()
{
    for (var i = 0; i < renderer.stage.children.length; i++)
    {
        next(renderer.stage.children[i]);
    }
}

// create the triangles
function triangle(size, color)
{
    var half = size / 2;
    var g = new PIXI.Graphics();
    renderer.add(g);
    g.beginFill(color);
    g.moveTo(0, -half);
    g.lineTo(-half, half);
    g.lineTo(half, half);
    g.closePath();
    g.endFill();
    return g;
}

## Live Example
https://davidfig.github.io/renderer/

see also

* https://davidfig.github.io/viewport/

## Installation
include update.js in your project or add to your workflow

    npm install --save davidfig/renderer

# API Reference
Wrapper for a PIXI.js Renderer

**Kind**: global class  

* [Renderer](#Renderer)
    * [new Renderer([options])](#new_Renderer_new)
    * [.render()](#Renderer+render)
    * [.update()](#Renderer+update)
    * [.countObjects()](#Renderer+countObjects)
    * [.background(color)](#Renderer+background)
    * [.add(object, [to])](#Renderer+add)
    * [.addChild(object)](#Renderer+addChild)
    * [.addChildTo(object, to)](#Renderer+addChildTo)
    * [.remove(object)](#Renderer+remove)
    * [.clear()](#Renderer+clear)
    * [.resize([force])](#Renderer+resize)
    * [.dimensionSmall()](#Renderer+dimensionSmall) ⇒ <code>number</code>
    * [.dimensionBig()](#Renderer+dimensionBig) ⇒ <code>number</code>

<a name="new_Renderer_new"></a>

### new Renderer([options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> |  |  |
| [options.alwaysRender] | <code>boolean</code> | <code>false</code> | update renderer every update tick |
| [options.noWebGL] | <code>boolean</code> | <code>false</code> | use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer |
| [options.canvas] | <code>HTMLCanvasElement</code> |  | place renderer in this canvas |
| [options.parent] | <code>HTMLElement</code> | <code>document.body</code> | if no canvas is provided, use parent to provide parent for generated canvas; otherwise uses document.body |
| [options.aspectRatio] | <code>number</code> |  | resizing will maintain aspect ratio by ensuring that the smaller dimension fits |
| [options.autoresize] | <code>boolean</code> |  | automatically calls resize during resize events |
| [options.color] | <code>number</code> | <code>0xffffff</code> | background color in hex |
| [options.antialias] | <code>boolean</code> | <code>true</code> | turn on antialias; if native antialias is not used, uses FXAA |
| [options.forceFXAA] | <code>boolean</code> | <code>false</code> | forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great |
| [options.resolution] | <code>number</code> | <code>1</code> | / device pixel ratio of the renderer (e.g., original retina is 2) |
| [options.clearBeforeRender] | <code>boolean</code> | <code>true</code> | sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`. |
| [options.preserveDrawingBuffer] | <code>boolean</code> | <code>false</code> | enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context. |
| [options.roundPixels] | <code>boolean</code> | <code>false</code> | if true PIXI will Math.floor() x/y values when rendering, stopping pixel interpolation |
| [options.styles] | <code>object</code> |  | apply these CSS styles to the div |
| [options.debug] | <code>object</code> |  | pass Debug from github.com/davidfig/debug |
| [options.panel] | <code>string</code> |  | name for debug panel |
| [options.side] | <code>string</code> | <code>&quot;&#x27;bottomRight&#x27;&quot;</code> | for debug panel ('bottomRight', 'bottomLeft', 'topLeft', or 'topRight') |
| [options.update] | <code>object</code> |  | pass Update from github.com/davidfig/update |

<a name="Renderer+render"></a>

### renderer.render()
force an immediate render without checking dirty flag

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  
<a name="Renderer+update"></a>

### renderer.update()
render the scene

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  
<a name="Renderer+countObjects"></a>

### renderer.countObjects()
counts visible objects

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  
<a name="Renderer+background"></a>

### renderer.background(color)
sets the background color

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | in CSS format |

<a name="Renderer+add"></a>

### renderer.add(object, [to])
adds object to stage

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>PIXI.DisplayObject</code> |  |
| [to] | <code>number</code> | index to add |

<a name="Renderer+addChild"></a>

### renderer.addChild(object)
alias for add

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type |
| --- | --- |
| object | <code>PIXI.DisplayObject</code> | 

<a name="Renderer+addChildTo"></a>

### renderer.addChildTo(object, to)
alias for add

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>PIXI.DisplayObject</code> |  |
| to | <code>number</code> | index to add |

<a name="Renderer+remove"></a>

### renderer.remove(object)
remove child from stage

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type |
| --- | --- |
| object | <code>PIXI.DisplayObject</code> | 

<a name="Renderer+clear"></a>

### renderer.clear()
clears the stage

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  
<a name="Renderer+resize"></a>

### renderer.resize([force])
resize

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | resize, even if cached width/height remain unchanged |

<a name="Renderer+dimensionSmall"></a>

### renderer.dimensionSmall() ⇒ <code>number</code>
returns the smaller of the width/height based

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  
<a name="Renderer+dimensionBig"></a>

### renderer.dimensionBig() ⇒ <code>number</code>
returns the larger of the width/height based

**Kind**: instance method of <code>[Renderer](#Renderer)</code>  

* * *

Copyright (c) 2016 YOPEY YOPEY LLC - MIT License - Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)