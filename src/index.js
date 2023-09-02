import './assets/styles/main.css'
import kontra from 'kontra' // { init, GameLoop, Sprite, imageAssets }
import Player from './classes/Player'
import NPC from './classes/NPC'
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


    // handle user input
    document.onkeydown = function (event) {
        switch (event.code) {
            case 'ArrowRight':
            case 'KeyD': player.setMoveDirection(1); break;
            case 'ArrowLeft':
            case 'KeyA': player.setMoveDirection(-1); break;
            case 'Space': player.setWinking(true); break;
        }
    }
    
    document.onkeyup = function (event) {
        switch (event.code) {
            case 'ArrowRight':
            case 'KeyD': player.setMoveDirection(0); break;
            case 'ArrowLeft':
            case 'KeyA': player.setMoveDirection(0); break;
            case 'Space': player.setWinking(false); break;
        }
    } 
      
      
    const loop = kontra.GameLoop({  // create the main game loop
        update () { // update the game state
            // TODO: Получается не нажатие а "зажатие". Это не верная механика. Надо поправить
            if (player.isWinking()) {
                women
                    .filter(woman => woman.checkIsPointInView(player.x) && woman.scaleX !== player.scaleX)
                    .forEach(woman => woman.activateRage(keepFollowingPlayerInSec))
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