import './assets/styles/main.css'
// TODO: Настроить импорт только того, что используется в коде
import kontra from 'kontra' // { init, GameLoop, Sprite, imageAssets }
import Player from './classes/Player'
import Man from './classes/Man'
import Woman from './classes/Woman'
import inputHelper from './helpers/inputHelper'
import sprites from './spritesMap'

// Constants
const   width = 1200,
        height = 800,
        keepFollowingPlayerInSec = 5,
        { canvas } = kontra.init(),
        movementBounds = { left: 150, right: 150 },
        gameEndTime = Date.now() + (60 * 1000)

async function setup () {
    canvas.width = width
    canvas.height = height
    // console.log(kontra)
    kontra.getContext().imageSmoothingEnabled = false
    await kontra.load(...Object.keys(sprites).map((key) => sprites[key]))
    const spriteSheets = (await import ('./spriteSheetsMap')).default
    const background = kontra.Sprite({ x: 0, y: 0, image: kontra.imageAssets[sprites.background] })
    const player = new Player({ x: 300, y: height - 250, animations: spriteSheets.playerSpritesheet.animations, scale: 3, extraAnimations: { winking: spriteSheets.winkingSpritesheet.animations } }) // image: kontra.imageAssets[sprites.player1_1]
    const men = Array(8).fill(null).map((item, index) => new Man({ x: 400 * (index + 1), y: height - 250, animations: spriteSheets[`men${kontra.randInt(1, 2)}Spritesheet`].animations, scale: 3 })) // image: kontra.imageAssets[sprites.man1_1]
    const women = Array(8).fill(null).map((item, index) => new Woman({ x: (400 * (index + 1)) + 100, y: height - 250, animations: spriteSheets.womenSpritesheet.animations, scale: 3, viewLength: 500 })) //  image: kontra.imageAssets[sprites.woman1_1]

    const timerText = kontra.Text({
        text: '-',
        font: '32px Arial',
        color: 'white',
        x: 50,
        y: 50,
        anchor: {x: 0, y: 0.5},
        textAlign: 'center'
      });

    const scene = kontra.Scene({
        id: 'game',
        objects: [background, ...men, ...women, player, timerText],
        width: background.width,
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
                            woman.activateAdrenaline(keepFollowingPlayerInSec)
                            player.activateAdrenaline(keepFollowingPlayerInSec)
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
                .filter(woman => woman.isAdrenalined())
                .forEach(woman => woman.setTargetX(player.x))

            player?.update(movementBounds, scene)
            background?.update()
            men.forEach(woman => woman.update())
            women.forEach(woman => woman.update())

            // Timer
            const timeLeft = Math.floor((gameEndTime - Date.now()) / 1000)
            timerText.text = `TIME LEFT: ${timeLeft < 0 ? 0 : timeLeft} s`
            timerText.x = 50 + scene.camera.x - scene.camera.width/2
            if (timeLeft <= 0) { loop.stop() }
        },
        render () { // render the game state
            scene.render()
        }
    })
    return loop
}

const loop = await setup()
loop.start() // start the game