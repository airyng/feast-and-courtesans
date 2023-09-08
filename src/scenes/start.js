import { Scene, GameLoop, randInt } from 'kontra'
import inputHelper from '../helpers/inputHelper'
import { textObjectGenerator, rectangleGenerator } from '../helpers/gameObjectGenerator'
import Player from '../classes/Player'
import { drawLine } from '../helpers/graphicsHelper'

export default async function setup (props, loadScene) {

    const starsNumber = 100

    const   background = rectangleGenerator({ width: props.width, height: props.height, color: 'rgb(30,30,30)' }),
            h1 = textObjectGenerator({ text: 'MEDIEVAL COURTESAN', x: props.width / 2, y: 150, color: 'white', font: '48px cursive, Arial' }),
            description = textObjectGenerator({
                                                text: 'Well... Today I need to seduce as many boyars as possible\nin order to extract gold from these moneybags.\nI hope there will be no competitors at the feast...',
                                                x: 250, y: props.height - 300, color: 'white', font: '18px cursive, Arial', textAlign: 'left'
                                            }),
            instructions = textObjectGenerator({
                                                text: 'Press \'arrows\' to move left and right. Press \'space\' to make an seductive wink',
                                                x: props.width / 2, y: props.height - 100, color: 'grey', font: '16px cursive, Arial'
                                            }),
            player = new Player({ x: 300, y: props.height - 250 + 6, animations: props.spriteSheets.playerSpritesheet.animations, scale: 3, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } }),
            stars = new Array(starsNumber).fill(null).map(() => ({ x: randInt(5, props.width - 5), y: randInt(5, props.height - 400), visible: true }))
            
    const starsBlinkingInterval = setInterval(() => {
        const hiddenStar = stars.find(star => !star.visible)
        if (hiddenStar) { hiddenStar.visible = true }
        stars[randInt(0, stars.length - 1)].visible = false
    }, 500)

    const scene = new Scene({
        id: 'startScreen',
        width: props.width,
        height: props.height
    });

    // Align to center
    [h1, instructions].forEach(obj => {
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
            drawLine(scene, {x: props.width - 150, y: gy - 5}, {x: props.width, y: gy - 5}, 'grey', 10) // Step 1
            drawLine(scene, {x: props.width - 100, y: gy - 15}, {x: props.width, y: gy - 15}, 'grey', 10) // Step 2
            drawLine(scene, {x: props.width - 50, y: gy - 25}, {x: props.width, y: gy - 25}, 'grey', 10) // Step 3
            drawLine(scene, {x: props.width - 5, y: gy - 500}, {x: props.width - 5, y: gy}, 'grey', 10) // Door

            stars.forEach((star) => {
                if (!star.visible) { return }
                drawLine(scene, {x: star.x, y: star.y}, {x: star.x + 1, y: star.y + 1}, 'grey')
            })
            ;[h1, description, instructions, player].forEach(obj => obj.render())
        }
    })

    scene.beforeDestroy = () => {
        loop.stop()
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        clearInterval(starsBlinkingInterval)
        scene.remove([h1, description, instructions, player, background])
    }

    return {loop, scene}
}