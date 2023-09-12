import { Scene, GameLoop } from 'kontra'
import inputHelper from '../helpers/inputHelper'
import { textObjectGenerator, rectangleGenerator } from '../helpers/gameObjectGenerator'
import Player from '../classes/Player'
import { drawLine, createBlinkingStars } from '../helpers/graphicsHelper'

export default async function setup (props, loadScene) {

    const   background = rectangleGenerator({ width: props.width, height: props.height, color: 'rgb(30,30,30)' }),
            h1 = textObjectGenerator({ text: 'Feast and courtesans', x: props.width / 2, y: 150, color: 'white', fontSize: 48 }),
            description = textObjectGenerator({
                                                text: 'Well... Today I need to seduce as many boyars as possible\nin order to extract gold from these moneybags.\nI hope there will be no competitors at the feast...',
                                                x: 250, y: props.height - 300, color: 'white', fontSize: 18, textAlign: 'left'
                                            }),
            instructions = textObjectGenerator({
                                                text: 'Press \'arrows\' to move left and right. Press \'space\' to make an seductive wink',
                                                x: props.width / 2, y: props.height - 100, color: 'grey', fontSize: 16
                                            }),
            player = new Player({ x: 300, y: props.height - 250 + 6, animations: props.spriteSheets.playerSpritesheet.animations, scale: 3, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } })
            
    const scene = new Scene({
        id: 'startScreen',
        width: props.width,
        height: props.height
    });
    const blinkingStars = createBlinkingStars(100, scene, { x: 5, y: 5 }, { x: props.width - 5, y: props.height - 400 })

    // Align to center
    ;[h1, instructions].forEach(obj => {
        obj.x -= obj.width / 2 
    })

    inputHelper.init()
    inputHelper.on('Space', () => player.setWinking(true))
    inputHelper.on('ArrowRight', null, () => player.setMoveDirection(0))
    inputHelper.on('ArrowLeft', null, () => player.setMoveDirection(0))

    const loop = new GameLoop({  // create the main game loop
        update () { // update the game state
            const maxPriorityKey = inputHelper.getMaxPriorityPressedButton(['ArrowRight', 'ArrowLeft'])
            if (maxPriorityKey) {
                player.setMoveDirection(maxPriorityKey === 'ArrowLeft' ? -1 : 1)
            }

            if (player.x >= props.width - 200) {
                loadScene(scene, props.sceneSetupsList.game)
            }

            player.update(scene)
        },
        render () { // render the game state
            background.render()
            const gy = props.height - 130
            drawLine(scene, {x: 0, y: gy}, {x: props.width, y: gy}) // Ground
            drawLine(scene, {x: props.width - 150, y: gy - 5}, {x: props.width, y: gy - 5}, 10) // Step 1
            drawLine(scene, {x: props.width - 100, y: gy - 15}, {x: props.width, y: gy - 15}, 10) // Step 2
            drawLine(scene, {x: props.width - 50, y: gy - 25}, {x: props.width, y: gy - 25}, 10) // Step 3
            drawLine(scene, {x: props.width - 5, y: gy - 280}, {x: props.width - 5, y: gy}, 10) // Door

            blinkingStars.render()
            ;[h1, description, instructions, player].forEach(obj => obj.render())
        }
    })

    scene.beforeDestroy = () => {
        loop.stop()
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        blinkingStars.destroy()
        scene.remove([h1, description, instructions, player, background])
    }

    return {loop, scene}
}