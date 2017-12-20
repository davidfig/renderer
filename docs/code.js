const Random = require('yy-random')
const PIXI = require('pixi.js')
const Ease = require('pixi-ease')
const easyedit = require('easyedit')

const Renderer = require('..')

let renderer, eases

let count = 100

function test()
{
    // creates the renderer, updating every frame
    renderer = new Renderer({ debug: true, turnOffTicker: true, turnOffInteraction: true, styles: { pointerEvents: 'none' }, FPS: 60, pauseOnBlur: true})

    // set initial position for all triangles
    for (let i = 0; i < count; i++)
    {
        const t = triangle(Random.get(renderer.width * 0.1, true), Random.color())
        t.position.set(Random.get(renderer.width), Random.get(renderer.height))
    }

    next()

    // easing list updates each tick
    renderer.interval(eases.update.bind(eases))

    // restart triangles every 6 seconds
    renderer.interval(next, 6000)

    // start the renderer loop
    renderer.start()
}

// animate one triangle with random values
function next()
{
    for (let t of renderer.stage.children)
    {
        // randomly make some triangles invisible to test count
        t.visible = Random.chance(0.9)

        const x = Random.get(renderer.width)
        const y = Random.get(renderer.height)
        const scale = Random.get(3, true)
        const alpha = Random.get(0.5, true)
        const rotation = Random.angle()
        const time = Random.range(1000, 4000)
        const ease = eases.to(t, { alpha, x, y, scale, rotation }, time, { ease: 'easeInOutSine' })
        ease.on('each', () => renderer.dirty = true)
    }
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

function FPS()
{
    const fps = document.createElement('div')
    document.body.appendChild(fps)
    fps.style.borderRadius = '5%'
    fps.style.position = 'fixed'
    fps.style.left = '1em'
    fps.style.top = '50%'
    fps.style.transform = 'translate(0, -60%)'
    fps.style.background = 'rgba(0, 100, 0, 0.5)'
    fps.style.color = 'white'
    fps.style.padding = '0.2em 0.5em'
    fps.style.fontSize = '2em'
    fps.style.textAlign = 'center'
    const edit = document.createElement('span')
    fps.appendChild(edit)
    edit.style.borderBottom = '1px dashed white'
    edit.innerText = '60'
    edit.style.cursor = 'cursor'
    const title = document.createElement('span')
    fps.appendChild(title)
    title.innerText = ' FPS'
    title.style.cursor = 'default'
    new easyedit(edit, { onsuccess:
        function (value)
        {
            renderer.fps = parseInt(value)
        }})
}

window.onload = function ()
{
    eases = new Ease.list()
    test()
    FPS()
    require('./highlight')('https://github.com/davidfig/renderer')
}