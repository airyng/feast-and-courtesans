import { Scene, Sprite, randInt, imageAssets, GameLoop } from 'kontra'
import Player from '../classes/Player'
import Man from '../classes/Man'
import Woman from '../classes/Woman'
import inputHelper from '../helpers/inputHelper'
import { textObjectGenerator } from '../helpers/gameObjectGenerator'

export default async function setup (props) {

    const   keepFollowingPlayerInSec = 5

    let points = 0,
        timerStarted = false,
        gameEndTime = null

    const background = new Sprite({ x: 0, y: 0, image: imageAssets[props.sprites.background] })
    const player = new Player({ x: 300, y: props.height - 250, animations: props.spriteSheets.playerSpritesheet.animations, scale: 3, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } })
    const men = Array(8).fill(null).map((item, index) => new Man({ x: 400 * (index + 1), y: props.height - 250, animations: props.spriteSheets[`men${randInt(1, 2)}Spritesheet`].animations, scale: 3 }))
    const women = Array(8).fill(null).map((item, index) => new Woman({ x: (400 * (index + 1)) + 100, y: props.height - 250, animations: props.spriteSheets.womenSpritesheet.animations, scale: 3, viewLength: 500 }))

    const timerText = textObjectGenerator()
    const pointsText = textObjectGenerator({x: 50, y: 100})
    const preStartText = textObjectGenerator({x: props.width / 2, y: props.height / 2 - 200, font: '80px cursive, Arial', anchor: {x: 0.5, y: 0.5}})
    const scene = new Scene({
        id: 'game',
        objects: [background, ...men, ...women, player, timerText, pointsText],
        width: imageAssets[props.sprites.background].width,
        height: props.height
    });

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const startGameplay = () => {
        gameEndTime = Date.now() + (60 * 1000)
        timerStarted = true
        inputHelper.init()
        inputHelper.on('Space', () => player.setWinking(true))
        inputHelper.on('ArrowRight', null, () => player.setMoveDirection(0))
        inputHelper.on('ArrowLeft', null, () => player.setMoveDirection(0))
    }

    preStartText.text = ''
    setTimeout(async () => {
        preStartText.text = 'READY'
        await sleep(1000)
        preStartText.text = 'STEADY'
        await sleep(1000)
        preStartText.text = 'GO'
        startGameplay()
        await sleep(1000)
        preStartText.text = ''
    }, 500)
            
    const loop = new GameLoop({  // create the main game loop
        update () { // update the game state
            const maxPriorityKey = inputHelper.getMaxPriorityPressedButton(['ArrowRight', 'ArrowLeft'])
            if (timerStarted && maxPriorityKey) {
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
                            const prevLoveLevel = man._loveLevel
                            man.increaseLoveLevel()
                            if (prevLoveLevel < 3 && man._loveLevel === 3) { points++ }
                        }
                    })
                player.setWinking(false)
            }

            women
                .filter(woman => woman.isAdrenalined())
                .forEach(woman => woman.setTargetX(player.x))

            player?.update(scene)
            background?.update()
            men.forEach(woman => woman.update())
            women.forEach(woman => woman.update())

            // Points
            pointsText.text = `LOVERS ATTRACTED: ${points}/${men.length}`
            pointsText.x = 50 + scene.camera.x - scene.camera.width/2

            // Timer
            if (timerStarted && gameEndTime) {
                const timeLeft = Math.floor((gameEndTime - Date.now()) / 1000)
                timerText.text = `TIME LEFT: ${timeLeft < 0 ? 0 : timeLeft} s`
                if (timeLeft <= 0) { loop.stop() }
            } else {
                timerText.text = `TIME LEFT: -`
            }
            timerText.x = 50 + scene.camera.x - scene.camera.width/2
        },
        render () { // render the game state
            scene.render()
            preStartText.render()
        }
    })

    scene.beforeDestroy = () => {
        loop.stop()
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        ;[...man, ...woman].forEach(obj => obj.clearCycle())
        scene.remove([...scene.objects, preStartText])
    }

    return {loop, scene}
}