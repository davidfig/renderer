// yy-renderer
// by David Figatner
// (c) YOPEY YOPEY LLC 2017
// MIT License
// https://github.com/davidfig/update

const PIXI = require('pixi.js')
const FPS = require('yy-fps')
const Loop = require('yy-loop')
const exists = require('exists')

class Renderer extends Loop
{
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
    {
        options = options || {}
        super({ pauseOnBlur: options.pauseOnBlur, maxFrameTime: options.maxFrameTime })
        this.canvas = options.canvas
        this.autoResize = options.autoresize
        this.aspectRatio = options.aspectRatio
        this.FPS = exists(options.FPS) ? 1000 / options.FPS : 0
        options.resolution = this.resolution = options.resolution || window.devicePixelRatio || 1
        options.antialias = exists(options.antialias) ? options.antialias : true
        options.transparent = true
        if (!this.canvas) this.createCanvas(options)
        options.view = this.canvas

        const noWebGL = options.noWebGL || false
        options.noWebGL = null
        options.autoresize = null
        const Renderer = noWebGL ? PIXI.CanvasRenderer : PIXI.WebGLRenderer

        this.renderer = new Renderer(options)
        if (options.color)
        {
            this.renderer.backgroundColor = options.color
        }
        if (options.styles)
        {
            for (let style in options.styles)
            {
                this.canvas.style[style] = options.styles[style]
            }
        }

        if (options.debug) this.createDebug(options)
        if (this.autoResize) window.addEventListener('resize', this.resize.bind(this))
        this.time = 0
        this.stage = new PIXI.Container()
        this.dirty = this.alwaysRender = options.alwaysRender || false
        this.resize(true)
        this.interval(this.updateRenderer.bind(this), this.FPS)
    }

    /**
     * create canvas if one is not provided
     * @private
     */
    createCanvas(options)
    {
        this.canvas = document.createElement('canvas')
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        if (options.parent)
        {
            options.parent.appendChild(this.canvas)
            options.parent = null
        }
        else
        {
            document.body.appendChild(this.canvas)
        }
        var width = this.canvas.offsetWidth
        var height = this.canvas.offsetHeight
        this.canvas.style.position = 'absolute'
        this.canvas.width = width * this.resolution
        this.canvas.height = height * this.resolution
        this.canvas.style.left = this.canvas.style.top = '0px'
        this.canvas.style.overflow = 'auto'
    }

    /**
     * create FPS meter and render indicator
     * @param {object} options
     */
    createDebug(options)
    {
        this.debug = options.debug
        const fpsOptions = options.fpsOptions || {}
        fpsOptions.FPS = options.FPS
        this.fps = new FPS(fpsOptions)
        const indicator = document.createElement('div')
        indicator.style.display = 'flex'
        indicator.style.justifyContent = 'space-between'
        this.fps.div.prepend(indicator)
        if (options.debug === true || options.debug === 1 || options.debug.toLowerCase().indexOf('dirty') !== -1)
        {
            this.dirtyIndicator = document.createElement('div')
            indicator.appendChild(this.dirtyIndicator)
            this.dirtyIndicator.innerHTML = '&#9624; '
        }
        if (options.debug === true || options.debug === 1 || options.debug.toLowerCase().indexOf('count') !== -1)
        {
            this.countIndicator = document.createElement('div')
            indicator.appendChild(this.countIndicator)
        }
    }

    debugUpdate()
    {
        this.dirtyIndicator.color = this.dirty
    }

    /**
     * immediately render without checking dirty flag
     */
    render()
    {
        this.renderer.render(this.stage)
        this.dirty = this.alwaysRender
    }

    /**
     * render the scene
     * @private
     */
    updateRenderer()
    {
        if (this.fps)
        {
            this.fps.frame()
            if (this.dirtyIndicator && this.lastDirty !== this.dirty)
            {
                this.dirtyIndicator.style.color = this.dirty ? 'white' : 'black'
                this.lastDirty = this.dirty
            }
            if (this.countIndicator)
            {
                const count = this.countObjects()
                if (this.lastCount !== count)
                {
                    this.countIndicator.innerText = count
                    this.lastCount = count
                }
            }
        }
        if (this.dirty)
        {
            this.render()
            this.dirty = this.alwaysRender
        }
    }

    /**
     * counts visible objects
     */
    countObjects()
    {
        function count(object)
        {
            if (!object.visible)
            {
                return
            }
            total++
            for (var i = 0; i < object.children.length; i++)
            {
                count(object.children[i])
            }
        }

        var total = 0
        count(this.stage)
        return total
    }

    /**
     * sets the background color
     * @param {string} color in CSS format
     */
    background(color)
    {
        this.canvas.style.backgroundColor = color
    }

    /**
     * adds object to stage
     * @param {PIXI.DisplayObject} object
     * @param {number} [to] index to add
     */
    add(object, to)
    {
        if (typeof to === 'undefined')
        {
            to = this.stage.children.length
        }
        this.stage.addChildAt(object, to)
        return object
    }

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     */
    addChild(object)
    {
        return this.add(object)
    }

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     * @param {number} to - index to add
     */
    addChildTo(object, to)
    {
        return this.add(object, to)
    }

    /**
     * remove child from stage
     * @param {PIXI.DisplayObject} object
     */
    remove(object)
    {
        this.stage.removeChild(object)
    }

    /**
     * clears the stage
     */
    clear()
    {
        this.stage.removeChildren()
    }

    /**
     * resize
     * @param {boolean} [force] resize, even if cached width/height remain unchanged
     */
    resize(force)
    {
        var width = this.canvas.offsetWidth
        var height = this.canvas.offsetHeight
        if (this.aspectRatio)
        {
            if (width > height)
            {
                width = height * this.aspectRatio
            }
            else
            {
                height = width / this.aspectRatio
            }
        }
        if (force || width !== this.width || height !== this.height)
        {
            this.width = width
            this.height = height
            this.canvas.width = width * this.resolution
            this.canvas.height = height * this.resolution
            this.renderer.resize(this.width, this.height)
            this.landscape = this.width > this.height
            this.dirty = true
        }
    }

    /**
     * returns the smaller of the width/height based
     * @return {number}
     */
    dimensionSmall()
    {
        return (this.landscape ? this.height : this.width)
    }

    /**
     * returns the larger of the width/height based
     * @return {number}
     */
    dimensionBig()
    {
        return (this.landscape ? this.width : this.height)
    }

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
    {
        super.remove(...arguments)
    }

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
}

module.exports = Renderer