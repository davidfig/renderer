## renderer.js
wrapper for PIXI.Renderer class for use with https://github.com/davidfig/update, https://github.com/davidfig/animate, and https://github.com/davidfig/debug

## Example

        // debug panel on the bottom right
        Debug.init();

        // used for automatic rendering
        Update.init();
        Update.update();

        // creates the renderer with one option
        var renderer = new Renderer({resize: true});

        // set initial position for all triangles
        for (var i = 0; i < 100; i++)
        {
            var t = triangle(Math.random() * renderer.width * 0.1, Math.random() * 0xffffff);
            t.position.set(Math.random() * renderer.width, Math.random() * renderer.height);
            next;
        }
        move();
        Update.add(move, 6000);

        debug('Notice the render light above automatically turns off when the animations stop.');

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
include renderer.js in your project or add to your workflow

    <script src="renderer.js"></script>

## API Reference

#### Renderer(options)
renderer wrapper for pixi.js
* options {}
  - noWebGL: use the PIXI.CanvasRenderer instead of PIXI.WebGLRenderer
  - div: place renderer in this div
  - aspectRatio: resizing will maintain aspect ratio by ensuring that the smaller dimension fits
  - autoresize: false (default) or true - automatically calls resize during resize event
  - color: background color in hex (0xffffff)
  - antialias: true (default) or false - if native antialias is not used, uses FXAA
  - forceFXAA: false (default) or true - forces FXAA antialiasing to be used over native. FXAA is faster, but may not always look as great
  - resolution: 1 (default) - resolution / device pixel ratio of the renderer (e.g., retina is 2)
  - clearBeforeRender: true (default) or false - sets if the CanvasRenderer will clear the canvas or before the render pass. If you wish to set this to false, you *must* set preserveDrawingBuffer to `true`.
  - preserveDrawingBuffer: false (default) or true - enables drawing buffer preservation, enable this if you need to call toDataUrl on the webgl context.
  - roundPixels: false (default) or true - If true Pixi will Math.floor() x/y values when rendering, stopping pixel interpolation
  - debug: name for debug panel
  - side: side for debug panel: 'bottomRight' (default), 'bottomLeft', 'topLeft', or 'topRight'

#### Renderer.render()
force an immediate render without checking dirty flag

#### Renderer.background(color)
sets the background color (in CSS format)

#### Renderer.add(object, to)
adds object to stage
* to: {number} optional location to insert the object

#### Renderer.remove(object)
remove child from stage

#### Renderer.clear()
clears stage

## License
MIT License (MIT)