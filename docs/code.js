const Random = require('yy-random')
const PIXI = require('pixi.js')
const Ease = require('pixi-ease')

const Renderer = require('..')

let renderer, eases

const COUNT = 100

function test()
{
    // creates the renderer, updating every frame
    renderer = new Renderer({ debug: true, alwaysRender: true, styles: { pointerEvents: 'none' }, FPS: 60 })

    // set initial position for all triangles
    for (let i = 0; i < COUNT; i++)
    {
        const t = triangle(Random.get(renderer.width * 0.1, true), Random.color())
        t.position.set(Random.get(renderer.width), Random.get(renderer.height))
        next(t)
    }

    // easing list updates each tick
    renderer.interval(eases.update.bind(eases))

    // start the renderer loop
    renderer.start()
}

// animate one triangle with random values
function next(t)
{
    const x = Random.get(renderer.width)
    const y = Random.get(renderer.height)
    const scale = Random.get(3, true)
    const alpha = Random.get(0.5, true)
    const rotation = Random.angle()
    const time = Random.range(1000, 4000)
    const ease = eases.to(t, { alpha, x, y, scale, rotation }, time, { ease: 'easeInOutSine' })
    ease.on('done', next)

}

// create the triangles
function triangle(size, color)
{
    var half = size / 2
    var g = new PIXI.Graphics()
    renderer.add(g)
    g.beginFill(color)
    g.moveTo(0, -half)
    g.lineTo(-half, half)
    g.lineTo(half, half)
    g.closePath()
    g.endFill()
    return g
}

window.onload = function ()
{
    eases = new Ease.list()
    test()
    require('./highlight')('https://github.com/davidfig/renderer')
}