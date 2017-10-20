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
```
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
     ** from yy-loop:
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
    remove(object)

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
     * start the internal loop
     * @inherited from yy-loop
     * @returns {Renderer} this
     */
    // start()

    /**
     * stop the internal loop
     * @inherited from yy-loop
     * @returns {Renderer} this
     */
    // stop()

    /**
     * loop through updates; can be called manually each frame, or called automatically as part of start()
     * @inherited from yy-loop
     */
    // update()

    /**
     * adds a callback to the loop
     * @inherited from yy-loop
     * @param {function} callback
     * @param {number} [time=0] in milliseconds to call this update (0=every frame)
     * @param {number} [count=0] number of times to run this update (0=infinite)
     * @return {object} entry - used to remove or change the parameters of the update
     */
    // interval(callback, time, count)

    /**
     * adds a one-time callback to the loop
     * @inherited from yy-loop
     * @param {function} callback
     * @param {number} time in milliseconds to call this update
     * @return {object} entry - used to remove or change the parameters of the update
     */
    // timeout(callback, time)

    /**
     * remove a callback from the loop
     * @inherited from yy-loop
     * @param {object} entry - returned by add()
     */
    removeInterval()

    /**
     * @inherited from yy-loop
     * removes all callbacks from the loop
     */
    // removeAll()

    /**
     * @inherited from yy-loop
     * @type {number} count of all animations
     */
    // get count()

    /**
     * @inherited from yy-loop
     * @type {number} count of running animations
     */
    // get countRunning()
```
## license  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
