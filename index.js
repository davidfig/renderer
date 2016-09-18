const PIXI = require('pixi.js');
const Easing = require('penner');
const Debug = require('yy-debug');
const Update = require('yy-update');
const Animate = require('yy-animate');
const Renderer = require('yy-renderer');

// debug panel on the bottom right
Debug.init();

// used for automatic rendering
Update.init({debug: Debug, percent: true, FPS: true});
Animate.init({update: Update, debug: Debug});
Update.update();

// creates the renderer
const resolution = window.devicePixelRatio;
const renderer = new Renderer({autoresize: true, resolution: resolution, debug: Debug, update: Update});
renderer.canvas.style.pointerEvents = 'none';

// set initial position for all triangles
for (var i = 0; i < 100; i++)
{
    var t = triangle(Math.random() * renderer.width * 0.1, Math.random() * 0xffffff);
    t.position.set(Math.random() * renderer.width, Math.random() * renderer.height);
    next;
}
move();
Update.add(move, {time: 6000});

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
    new Animate.to(t, {alpha: alpha, x: x, y: y, scale: {x: scaleX, y: scaleY}, rotation: rotation}, time, {renderer: renderer, ease: Easing.easeInOutSine});
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

// for eslint
/* globals window */