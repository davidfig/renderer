## renderer.js
wrapper around the renderer for PIXI.js

## Live Example
https://davidfig.github.io/renderer/

see also

* https://davidfig.github.io/viewport/

## Installation

    npm i yy-renderer

# API Reference
## Functions

<dl>
<dt><a href="#render">render()</a></dt>
<dd><p>force an immediate render without checking dirty flag</p>
</dd>
<dt><a href="#update">update()</a></dt>
<dd><p>render the scene</p>
</dd>
<dt><a href="#countObjects">countObjects()</a></dt>
<dd><p>counts visible objects</p>
</dd>
<dt><a href="#background">background(color)</a></dt>
<dd><p>sets the background color</p>
</dd>
<dt><a href="#add">add(object, [to])</a></dt>
<dd><p>adds object to stage</p>
</dd>
<dt><a href="#addChild">addChild(object)</a></dt>
<dd><p>alias for add</p>
</dd>
<dt><a href="#addChildTo">addChildTo(object, to)</a></dt>
<dd><p>alias for add</p>
</dd>
<dt><a href="#remove">remove(object)</a></dt>
<dd><p>remove child from stage</p>
</dd>
<dt><a href="#clear">clear()</a></dt>
<dd><p>clears the stage</p>
</dd>
<dt><a href="#resize">resize([force])</a></dt>
<dd><p>resize</p>
</dd>
<dt><a href="#dimensionSmall">dimensionSmall()</a> ⇒ <code>number</code></dt>
<dd><p>returns the smaller of the width/height based</p>
</dd>
<dt><a href="#dimensionBig">dimensionBig()</a> ⇒ <code>number</code></dt>
<dd><p>returns the larger of the width/height based</p>
</dd>
</dl>

<a name="render"></a>

## render()
force an immediate render without checking dirty flag

**Kind**: global function  
<a name="update"></a>

## update()
render the scene

**Kind**: global function  
<a name="countObjects"></a>

## countObjects()
counts visible objects

**Kind**: global function  
<a name="background"></a>

## background(color)
sets the background color

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>string</code> | in CSS format |

<a name="add"></a>

## add(object, [to])
adds object to stage

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>PIXI.DisplayObject</code> |  |
| [to] | <code>number</code> | index to add |

<a name="addChild"></a>

## addChild(object)
alias for add

**Kind**: global function  

| Param | Type |
| --- | --- |
| object | <code>PIXI.DisplayObject</code> | 

<a name="addChildTo"></a>

## addChildTo(object, to)
alias for add

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>PIXI.DisplayObject</code> |  |
| to | <code>number</code> | index to add |

<a name="remove"></a>

## remove(object)
remove child from stage

**Kind**: global function  

| Param | Type |
| --- | --- |
| object | <code>PIXI.DisplayObject</code> | 

<a name="clear"></a>

## clear()
clears the stage

**Kind**: global function  
<a name="resize"></a>

## resize([force])
resize

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [force] | <code>boolean</code> | resize, even if cached width/height remain unchanged |

<a name="dimensionSmall"></a>

## dimensionSmall() ⇒ <code>number</code>
returns the smaller of the width/height based

**Kind**: global function  
<a name="dimensionBig"></a>

## dimensionBig() ⇒ <code>number</code>
returns the larger of the width/height based

**Kind**: global function  

* * *

Copyright (c) 2016 YOPEY YOPEY LLC - MIT License - Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)