import './assets/styles/main.css'
import kontra from 'kontra' // { init, GameLoop, Sprite, imageAssets }
import Player from './classes/Player'
import Man from './classes/Man'
import Women from './classes/Women'
// import FPSChecker from './classes/FPSChecker'
// import RecourceLoader from './classes/ResourceLoader'

// Constants
const   width = 1200,
        height = 800,
        keepFollowingPlayerInSec = 5,
        { canvas } = kontra.init(),
        movementBounds = { left: 150, right: 150 },
        sprites = {}

let moveDirection = 0
let winking = false
let ragedWomen = []
let rageStopTimoutId = null
// handle user input
document.onkeydown = function (event) {
    switch (event.code) {
        case 'ArrowRight':
        case 'KeyD': moveDirection = 1; break;
        case 'ArrowLeft':
        case 'KeyA': moveDirection = -1; break;
        case 'Space': winking = true; break;
    }
}
  
document.onkeyup = function (event) {
    switch (event.code) {
        case 'ArrowRight':
        case 'KeyD': moveDirection = 0; break;
        case 'ArrowLeft':
        case 'KeyA': moveDirection = 0; break;
        case 'Space': winking = false; break;
    }
} 

async function setup () {
    canvas.width = width
    canvas.height = height
    // console.log(kontra)
    sprites.background = require('./assets/images/background.jpg')
    await kontra.load(sprites.background)
    sprites.background = kontra.Sprite({ x: 0, y: 0, image: kontra.imageAssets[sprites.background] })

    const player = new Player({ x: 300, y: height - 250 })
    const men = Array(8).fill(null).map((item, index) => new Man({ x: 400 * (index + 1), y: height - 250 })) 
    const women = Array(8).fill(null).map((item, index) => new Women({ x: (400 * (index + 1)) + 100, y: height - 250 })) 

    const scene = kontra.Scene({
        id: 'game',
        objects: [sprites.background, ...men, ...women, player],
        width: sprites.background.width,
        height
    });
      
      
    const loop = kontra.GameLoop({  // create the main game loop
        update () { // update the game state
            // Странный код. Не нравится. Надо как-то улучшить.
            if (winking) {
                if (!ragedWomen.includes(women[0]))
                    ragedWomen.push(women[0])
                
                clearTimeout(rageStopTimoutId)
                rageStopTimoutId = setTimeout(() => {
                    ragedWomen = []
                }, 1000 * keepFollowingPlayerInSec)
            }

            ragedWomen.forEach((woman) => {
                woman.setTargetX(player.x)
            })
            ///

            // Возможно это надо перенести в кастом апдейт плеера
            player.movementUpdate(moveDirection, movementBounds, scene)

            player?.update()
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