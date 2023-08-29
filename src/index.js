import './assets/styles/main.css'
import kontra from 'kontra' // { init, GameLoop, Sprite, imageAssets }
import Player from './classes/Player'
// import FPSChecker from './classes/FPSChecker'
// import RecourceLoader from './classes/ResourceLoader'

// Constants
const   width = 1200,
        height = 800,
        { canvas } = kontra.init(),
        ctx = canvas.getContext('2d'),
        movementBounds = { left: 150, right: 150 },
        sprites = {}

let moveDirection = 0
// handle user input
document.onkeydown = function (event) {
    switch (event.code) {
        // case 'ArrowUp':
        // case 'KeyW': moveDirection = 1; break;
        // case 'ArrowDown':
        // case 'KeyS': moveDirection = -1; break;
        case 'ArrowRight':
        case 'KeyD': moveDirection = 1; break;
        case 'ArrowLeft':
        case 'KeyA': moveDirection = -1; break;
    }
}
  
document.onkeyup = function (event) {
    switch (event.code) {
        // case 'ArrowUp':
        // case 'KeyW': moveDirection = 0; break;
        // case 'ArrowDown':
        // case 'KeyS': moveDirection = 0; break;
        case 'ArrowRight':
        case 'KeyD': moveDirection = 0; break;
        case 'ArrowLeft':
        case 'KeyA': moveDirection = 0; break;
    }
} 

async function setup () {
    return new Promise ((resolve) => {
        // await RecourceLoader.load(require('./assets/images/background.jpg'), 'background')
        canvas.width = width
        canvas.height = height
        // console.log(kontra)
        sprites.background = require('./assets/images/background.jpg')
        kontra.load(sprites.background).then(() => {
            sprites.background = kontra.Sprite({ x: 0, y: 0, image: kontra.imageAssets[sprites.background] })
            const player = new Player({ height })

            const loop = kontra.GameLoop({  // create the main game loop
                update () { // update the game state


                    player.movementUpdate(moveDirection, sprites.background, movementBounds, width)
                    
                    player?.update()
                    sprites.background?.update()
                },
                render () { // render the game state
            
                    sprites.background?.render()
                    player?.render()
                    
                    // renderer2d.skybox(RecourceLoader.getImage('skybox'), player.rotation, fov)
            
                    // Render FPS to screen
                    // renderer2d.text('FPS: ' + FPSChecker.fpsRate, 5, 15, 'white ')
                }
            })
            resolve(loop)
        })
    })
    // const backgroundImage = new Image()
    // backgroundImage.src = require('./assets/images/background.jpg')
    // backgroundImage.onload = function () {
    //     sprites.background = Sprite({ x: 0, y: 0, image: backgroundImage })
    // }
}

const loop = await setup()
loop.start() // start the game