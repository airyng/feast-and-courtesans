import './assets/styles/main.css'
// TODO: Настроить импорт только того, что используется в коде
import kontra from 'kontra' // { init, GameLoop, Sprite, imageAssets }
import Player from './classes/Player'
import NPC from './classes/NPC'
import inputHelper from './helpers/inputHelper'
// import FPSChecker from './classes/FPSChecker'
// import RecourceLoader from './classes/ResourceLoader'

// Constants
const   width = 1200,
        height = 800,
        keepFollowingPlayerInSec = 5,
        { canvas } = kontra.init(),
        movementBounds = { left: 150, right: 150 },
        sprites = {}

async function setup () {
    canvas.width = width
    canvas.height = height
    // console.log(kontra)
    sprites.background = require('./assets/images/background.jpg')
    await kontra.load(sprites.background)
    sprites.background = kontra.Sprite({ x: 0, y: 0, image: kontra.imageAssets[sprites.background] })

    const player = new Player({ x: 300, y: height - 250 })
    const men = Array(8).fill(null).map((item, index) => new NPC({ x: 400 * (index + 1), y: height - 250, color: 'blue' })) 
    const women = Array(8).fill(null).map((item, index) => new NPC({ x: (400 * (index + 1)) + 100, y: height - 250, color: 'pink' })) 

    const scene = kontra.Scene({
        id: 'game',
        objects: [sprites.background, ...men, ...women, player],
        width: sprites.background.width,
        height
    });

    inputHelper.init()
    inputHelper.on('Space', () => player.setWinking(true))
    inputHelper.on('ArrowRight', null, () => player.setMoveDirection(0))
    inputHelper.on('ArrowLeft', null, () => player.setMoveDirection(0))
            
    const loop = kontra.GameLoop({  // create the main game loop
        update () { // update the game state
            const maxPriorityKey = inputHelper.getMaxPriorityPressedButton(['ArrowRight', 'ArrowLeft'])
            if (maxPriorityKey) {
                player.setMoveDirection(maxPriorityKey === 'ArrowLeft' ? -1 : 1)
            }

            if (player.isWinking()) {
                women.forEach(woman => {
                        if (woman.checkIsPointInView(player.x) && woman.scaleX !== player.scaleX) {
                            woman.activateRage(keepFollowingPlayerInSec)
                        }
                    })

                men.forEach(man => {
                        if (man.checkIsPointInView(player.x) && man.scaleX !== player.scaleX) {
                            man.increaseLoveLevel()
                        }
                    })
                player.setWinking(false)
            }

            women
                .filter(woman => woman.isRaged())
                .forEach(woman => woman.setTargetX(player.x))

            player?.update(movementBounds, scene)
            sprites.background?.update()
            women.forEach(woman => woman.update())
        },
        render () { // render the game state
            scene.render()
        }
    })
    return loop
}

const loop = await setup()
loop.start() // start the game