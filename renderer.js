/**
 * @file renderer.js
 * @author David Figatner
 * @license MIT
 * @copyright YOPEY YOPEY LLC 2016
 * {@link https://github.com/davidfig/update}
 */

// placeholder for Debug and Update modules (@see {@link http://github.com/davidfig/debug} and {@link http://github.com/davidfig/update})
let Debug, Update;

/** Wrapper for a PIXI.js Renderer */
class Renderer
{
    /**
     * Wrapper for a PIXI.js Renderer
     * @param {object} [options]
     * @param {boolean} [options.alwaysRender=false] update renderer every update tick
     * @param {boolean} [options.noWebGL=false] use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer
     * @param {HTMLCanvasElement} [options.canvas] place renderer in this canvas
     * @param {HTMLElement} [options.parent=document.body] if no canvas is provided, use parent to provide parent for generated canvas; otherwise uses document.body
     * @param {number} [options.aspectRatio] resizing will maintain aspect ratio by ensuring that the smaller dimension fits
     * @param {boolean} [options.autoresize=false] automatically calls resize during resize events
     * @param {number} [options.color=0xffffff] background color in hex
     * @param {boolean} [options.antialias=true] turn on antialias; if native antialias is not used, uses FXAA
     * @param {boolean} [options.forceFXAA=false] forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great
     * @param {number} [options.resolution=window.devicePixelRatio] / device pixel ratio of the renderer (e.g., original retina is 2)
     * @param {boolean} [options.clearBeforeRender=true] sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`.
     * @param {boolean} [options.preserveDrawingBuffer=false] enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context.
     * @param {boolean} [options.roundPixels=false] if true PIXI will Math.floor() x/y values when rendering, stopping pixel interpolation
     * @param {object} [options.styles] apply these CSS styles to the div
     * @param {object} [options.update] pass Update from github.com/davidfig/update
     * @param {object} [options.debug] pass Debug from github.com/davidfig/debug
     * @param {string} [options.debugPanel] name for debug panel
     * @param {string} [options.debugSide='bottomRight'] for debug panel ('bottomRight', 'bottomLeft', 'topLeft', or 'topRight')
    */
    constructor(options)
    {
        options = options || {};
        this.canvas = options.canvas;
        options.resolution = this.resolution = options.resolution || window.devicePixelRatio || 1;
        if (!this.canvas)
        {
            this.canvas = document.createElement('canvas');
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            if (options.parent)
            {
                options.parent.appendChild(this.canvas);
                options.parent = null;
            }
            else
            {
                document.body.appendChild(this.canvas);
            }
            var width = this.canvas.offsetWidth;
            var height = this.canvas.offsetHeight;
            this.canvas.style.position = 'absolute';
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
            Debug = options.debug;
            var name = options.debugPanel || 'PIXI';
            this.debug = Debug.add(name, {side: options.debugSide, text: name + ': <span style="background:white">X</span> 0 objects'});
            this.debug.name = name;
        }
        if (options.update)
        {
            Update = options.update;
            Update.add(this.update.bind(this), {percent: options.debug ? options.debugPanel || 'PIXI' : null});
        }
        if (this.autoResize)
        {
            window.addEventListener('resize', this.resize.bind(this));
        }
        this.resize(true);
    }

    /** force an immediate render without checking dirty flag */
    render()
    {
        this.renderer.render(this.stage);
    }

    /** render the scene */
    update()
    {
        if (this.debug && (this.dirty || this.last))
        {
            var count = this.countObjects();
            if (this.last !== this.dirty || count !== this.lastCount)
            {
                var color = this.dirty ? 'white' : 'gray';
                Debug.one(this.debug.name + ': <span style="background: ' + color + '; color: ' + color + '">X</span> ' + count + ' objects', {panel: this.debug});
                this.last = this.dirty;
                this.lastCount = count;
            }
        }
        if (this.dirty)
        {
            this.render();
            this.dirty = this.alwaysRender;
        }
    }

    /** counts visible objects */
    countObjects()
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
    }

    /**
     * sets the background color
     * @param {string} color in CSS format
     */
    background(color)
    {
        this.canvas.style.backgroundColor = color;
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
            to = this.stage.children.length;
        }
        this.stage.addChildAt(object, to);
        return object;
    }

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     */
    addChild(object)
    {
        return this.add(object);
    }

    /**
     * alias for add
     * @param {PIXI.DisplayObject} object
     * @param {number} to - index to add
     */
    addChildTo(object, to)
    {
        return this.add(object, to);
    }

    /**
     * remove child from stage
     * @param {PIXI.DisplayObject} object
     */
    remove(object)
    {
        this.stage.removeChild(object);
    }

    /**
     * clears the stage
     */
    clear()
    {
        this.stage.removeChildren();
    }

    /**
     * resize
     * @param {boolean} [force] resize, even if cached width/height remain unchanged
     */
    resize(force)
    {
        var width = this.canvas.offsetWidth;
        var height = this.canvas.offsetHeight;
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
            this.canvas.width = width * this.resolution;
            this.canvas.height = height * this.resolution;
            this.renderer.resize(this.width, this.height);
            this.landscape = this.width > this.height;
            this.dirty = true;
        }
    }

    /**
     * returns the smaller of the width/height based
     * @return {number}
     */
    dimensionSmall()
    {
        return (this.landscape ? this.height : this.width);
    }

    /**
     * returns the larger of the width/height based
     * @return {number}
     */
    dimensionBig()
    {
        return (this.landscape ? this.width : this.height);
    }
}

module.exports = Renderer;

// for eslint
/* globals document, window */