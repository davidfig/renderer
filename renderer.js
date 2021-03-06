// yy-renderer
// by David Figatner
// (c) YOPEY YOPEY LLC 2017
// MIT License
// https://github.com/davidfig/update

const PIXI = require('pixi.js')
const FPS = require('yy-fps')
const Loop = require('yy-loop')
const exists = require('exists')

class Renderer
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
    {
        options = options || {}
        this.options = options
        this.loop = new Loop({ pauseOnBlur: options.pauseOnBlur, maxFrameTime: options.maxFrameTime })
        this.canvas = options.canvas
        this.autoResize = options.autoresize
        this.aspectRatio = options.aspectRatio
        this.FPS = exists(options.FPS) ? 1000 / options.FPS : 0
        options.resolution = this.resolution = options.resolution || window.devicePixelRatio || 1
        options.antialias = exists(options.antialias) ? options.antialias : true
        options.transparent = true
        if (!this.canvas) this.createCanvas(options)
        options.view = this.canvas

        if (options.turnoffTicker)
        {
            const ticker = PIXI.ticker.shared
            ticker.autoStart = false
            ticker.stop()
        }

        const noWebGL = options.noWebGL || false
        options.noWebGL = null
        options.autoresize = null
        const Renderer = noWebGL ? PIXI.CanvasRenderer : PIXI.WebGLRenderer

        this.renderer = new Renderer(options)
        if (options.turnOffInteraction)
        {
            this.renderer.plugins.interaction.destroy()
        }
        if (options.color)
        {
            this.canvas.style.backgroundColor = options.color
        }
        if (options.styles)
        {
            for (let style in options.styles)
            {
                this.canvas.style[style] = options.styles[style]
            }
        }

        if (options.debug) this.createDebug(options)
        if (this.autoResize) window.addEventListener('resize', () => this.resize())
        this.time = 0
        this.stage = new PIXI.Container()
        this.dirty = this.alwaysRender = options.alwaysRender || false
        this.resize(true)
    }

    /**
     * create canvas if one is not provided
     * @private
     */
    createCanvas(options)
    {
        this.canvas = document.createElement('canvas')
        this.canvas.style.width = '100vw'
        this.canvas.style.height = '100vh'
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
        this.fpsMeter = new FPS(fpsOptions)
        const indicator = document.createElement('div')
        indicator.style.display = 'flex'
        indicator.style.justifyContent = 'space-between'
        this.fpsMeter.div.prepend(indicator)
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
     * @private
     */
    update()
    {
        if (this.fpsMeter)
        {
            this.fpsMeter.frame()
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
            for (let i = 0, _i = object.children.length; i < _i; i++)
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
    removeChild(object)
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
     * getter/setter to change desired FPS of renderer
     */
    get fps()
    {
        return this.FPS
    }
    set fps(value)
    {
        this.FPS = 1000 / value
        if (this.loop)
        {
            this.loop.remove(this.loopSave)
            this.loopSave = this.loop.add(() => this.update(), this.FPS)
        }
        if (this.fpsMeter)
        {
            this.fpsMeter.fps = value
        }
    }

    /**
     * Add a listener for a given event to yy-loop
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     */
    on()
    {
        this.loop.on(...arguments)
    }

    /**
     * Add a one-time listener for a given event to yy-loop
     * @param {(String|Symbol)} event The event name.
     * @param {Function} fn The listener function.
     * @param {*} [context=this] The context to invoke the listener with.
     * @returns {EventEmitter} `this`.
     * @public
     */
    once()
    {
        this.loop.once(...arguments)
    }

    /**
     * start the internal loop
     * @returns {Renderer} this
     */
    start()
    {
        this.loopSave = this.loop.add(() => this.update(), this.FPS)
        this.loop.start()
        return this
    }

    /**
     * stop the internal loop
     * @inherited from yy-loop
     * @returns {Renderer} this
     */
    stop()
    {
        this.loop.stop()
    }
}

module.exports = Renderer