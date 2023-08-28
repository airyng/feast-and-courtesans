import './assets/styles/main.css'
import { init, GameLoop } from 'kontra'
import FPSChecker from './classes/FPSChecker'
import RecourceLoader from './classes/ResourceLoader'

// Constants
const   width = 1200,
        height = 800,
        { canvas } = init(),
        ctx = canvas.getContext('2d')
        
// handle user input
// document.onkeydown = function (event) {
//     switch (event.code) {
//         case 'ArrowUp':
//         case 'KeyW': player.moveDirection = 1; break;
//         case 'ArrowDown':
//         case 'KeyS': player.moveDirection = -1; break;
//         case 'ArrowRight':
//         case 'KeyD': player.rotateDirection = -1; break;
//         case 'ArrowLeft':
//         case 'KeyA': player.rotateDirection = 1; break;
//     }
// }
  
// document.onkeyup = function (event) {
//     switch (event.code) {
//         case 'ArrowUp':
//         case 'KeyW': player.moveDirection = 0; break;
//         case 'ArrowDown':
//         case 'KeyS': player.moveDirection = 0; break;
//         case 'ArrowRight':
//         case 'KeyD': player.rotateDirection = 0; break;
//         case 'ArrowLeft':
//         case 'KeyA': player.rotateDirection = 0; break;
//     }
// } 

async function setup () {
    await RecourceLoader.load(require('./assets/images/background.jpg'), 'background')
    canvas.width = width
    canvas.height = height
}

let loop = GameLoop({  // create the main game loop
    update () { // update the game state

        FPSChecker.update()
    },
    render () { // render the game state
        
        // renderer2d.skybox(RecourceLoader.getImage('skybox'), player.rotation, fov)

        // Render FPS to screen
        renderer2d.text('FPS: ' + FPSChecker.fpsRate, 5, 15, 'white ')
    }
})

await setup()
loop.start() // start the game