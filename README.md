## renderer.js
wrapper for pixi.js renderer with automatic loop & clean/dirty settings 

## simple example
```
    const Renderer = require('yy-renderer)

    const renderer = new Renderer()

    const sprite = renderer.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100

    // starts renderer loop
    renderer.start()

    // do stuff

    // sets renderer to dirty to update during next frame
    renderer.dirty = true
```

## Live Example
https://davidfig.github.io/renderer/

## Installation

    npm i yy-renderer

## API Reference
```js
    /**
     * Wrapper for a pixi.js Renderer
     * @param {object} [options]
     * @param {boolean} [options.alwaysRender=false] update renderer every update tick
     * @param {number} [options.FPS=60] desired FPS for rendering (otherwise render on every tick)
     *
     * @param {HTMLCanvasElement} [options.canvas] place renderer in this canvas
     * @param {HTMLElement} [options.parent=document.body] if no canvas is provided, use parent to provide parent for generated canvas otherwise uses document.body
     * @param {object} [options.styles] apply these CSS styles to the div
     *
     * @param {number} [options.aspectRatio] resizing will maintain aspect ratio by ensuring that the smaller dimension fits
     * @param {boolean} [options.autoresize=false] automatically calls resize during resize events
     * @param {number} [options.color=0xffffff] background color in hex
     *
     * @param {boolean} [options.turnOffTicker] turn off PIXI.shared.ticker
     * @param {boolean} [options.turnOffInteraction] turn off PIXI.Interaction manager (saves cycles)
     *
     * @param {boolean} [options.noWebGL=false] use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer
     * @param {boolean} [options.antialias=true] turn on antialias if native antialias is not used, uses FXAA
     * @param {boolean} [options.forceFXAA=false] forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great
     * @param {number} [options.resolution=window.devicePixelRatio] / device pixel ratio of the renderer (e.g., original retina is 2)
     * @param {boolean} [options.clearBeforeRender=true] sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`.
     * @param {boolean} [options.preserveDrawingBuffer=false] enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context.
     * @param {boolean} [options.roundPixels=false] if true PIXI will Math.floor() x/y values when rendering, stopping pixel interpolation
     *
     * @param {boolean|string} [options.debug] false, true, or some combination of 'fps', 'dirty', and 'count' (e.g., 'count-dirty' or 'dirty')
     * @param {object} [options.fpsOptions] options from yy-fps (https://github.com/davidfig/fps)
     *
     * @param {number} [options.maxFrameTime=1000/60] maximum time in milliseconds for a frame
     * @param {object} [options.pauseOnBlur] pause loop when app loses focus, start it when app regains focus
     *
     * @event each(elapsed, Loop, elapsedInLoop)
     * @event start(Loop)
     * @event stop(Loop)
     */
    constructor(options)

    /**
     * create FPS meter and render indicator
     * @param {object} options
     */
    createDebug(options)

    /**
     * immediately render without checking dirty flag
     */
    render()

    /**
     * counts visible objects
     */
    countObjects()

    /**
     * sets the background color
     * @param {string} color in CSS format
     */
    background(color)

    /**
     * adds object to stage
     * @param {PIXI.DisplayObject} object
     * @param {number} [to] index to add
     */
    add(object, to)

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     */
    addChild(object)

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     * @param {number} to - index to add
     */
    addChildTo(object, to)

    /**
     * remove child from stage
     * @param {PIXI.DisplayObject} object
     */
    removeChild(object)

    /**
     * clears the stage
     */
    clear()

    /**
     * resize
     * @param {boolean} [force] resize, even if cached width/height remain unchanged
     */
    resize(force)

    /**
     * returns the smaller of the width/height based
     * @return {number}
     */
    dimensionSmall()

    /**
     * returns the larger of the width/height based
     * @return {number}
     */
    dimensionBig()

    /**
     * getter/setter to change desired FPS of renderer
     */
    get fps()

    /**
     * Add a listener for a given event to yy-loop
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     */
    on()

    /**
     * Add a one-time listener for a given event to yy-loop
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    once()

    /**
     * start the internal loop
     * @returns {Renderer} this
     */
    start()

    /**
     * stop the internal loop
     * @inherited from yy-loop
     * @returns {Renderer} this
     */
    stop()

```
## license  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
