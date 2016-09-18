## renderer.js
wrapper around the renderer for PIXI.js

## Live Example
https://davidfig.github.io/renderer/

see also

* https://davidfig.github.io/viewport/

## Installation

    npm i yy-renderer

# API Reference
<a name="Renderer"></a>

## Renderer
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
Wrapper for a PIXI.js Renderer


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