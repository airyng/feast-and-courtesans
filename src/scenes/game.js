import { Scene, Sprite, randInt, imageAssets, GameLoop, lerp } from 'kontra'
import Player from '../classes/Player'
import Man from '../classes/Man'
import Woman from '../classes/Woman'
import inputHelper from '../helpers/inputHelper'
import { textObjectGenerator, poolGenerator } from '../helpers/gameObjectGenerator'
import { createBlinkingStars, drawLine } from '../helpers/graphicsHelper'

const keepFollowingPlayerInSec = 4
const spriteScale = 3
// const playTime = 60 * 3
const colorRed = '#b20116'

export default async function setup (props, loadScene) {
    const   backgroundRepeatableImage = imageAssets[props.sprites.backgroundRepeatable],
            backgroundStartImage = imageAssets[props.sprites.backgroundStart],
            anchorCenter = {x: 0.5, y: 0.5},
            halfWidth = props.width / 2,
            halfHeight = props.height / 2

    let points = 0,
        timerStarted = false
        // gameEndTime = null

    const   candleImages = [116, 460, 814, 1230, 1580, 2000, 2350, 2762, 3120, 3372].map(x => new Sprite({ x, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.candle] })),
            backgroundStart = new Sprite({ x: 0, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: backgroundStartImage }),
            backgroundRepeatables = new Array(4).fill(null).map((item, index) => new Sprite({ x: (84 * spriteScale) + (index * backgroundRepeatableImage.width * spriteScale), y: 444, scaleX: spriteScale, scaleY: spriteScale, image: backgroundRepeatableImage })),
            carpetRepeatables = [imageAssets[props.sprites.carpet1], imageAssets[props.sprites.carpet2]].map((image, imageI) => new Array(120).fill(null).map((item, index) => new Sprite({ x: (index * image.width * spriteScale), y: imageI ? 681 : 630, scaleX: spriteScale, scaleY: spriteScale, image }))).flat(),
            walls = new Array(130).fill(null).map((item, index) => new Sprite({ x: (252 + (index * imageAssets[props.sprites.wall].width * spriteScale)), y: 207, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.wall] })),
            roosters = new Array(110).fill(null).map((item, index) => new Sprite({ x: (99 + (index * imageAssets[props.sprites.rooster].width * spriteScale)), y: 387, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.rooster] })),
            ceiling = new Sprite({ x: 252, y: 110, color: '#8d8688', width: 3072, height: 97 }),
            wallBrick = new Sprite({ x: 252, y: 363, color: colorRed, width: 3500, height: 24 }),
            carpetBrick = new Sprite({ x: 0, y: 652, color: colorRed, width: 3500, height: 30 }),
            sceneWidth = (backgroundStartImage.width * spriteScale) + (backgroundRepeatableImage.width * backgroundRepeatables.length * spriteScale),
            player = new Player({ x: 300, y: props.height - 250 + 6, animations: props.spriteSheets.playerSpritesheet.animations, scale: spriteScale, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } }),
            men = Array(8).fill(null).map((item, index) => new Man({ x: 390 * (index + 1), y: props.height - 250, animations: props.spriteSheets.men1Spritesheet.animations, scale: spriteScale })),
            women = Array(8).fill(null).map((item, index) => new Woman({ x: (390 * (index + 1)) + 100, y: props.height - 250 + 6, animations: props.spriteSheets.womenSpritesheet.animations, scale: spriteScale, viewLength: 500 })),
            // timerText = textObjectGenerator({x: 50, y: 40}),
            pointsText = textObjectGenerator({x: 50, y: 80}),
            preStartText = textObjectGenerator({x: halfWidth, y: 65, fontSize: 80, anchor: anchorCenter}),
            killedText = textObjectGenerator({x: halfWidth, y: halfHeight, fontSize: 80, anchor: anchorCenter, text: 'You\'re dead', opacity: 0}),
            winText = textObjectGenerator({x: halfWidth, y: halfHeight, fontSize: 80, anchor: anchorCenter, text: 'All the boyars are seduced 😜', opacity: 0}),
            timeOverText = textObjectGenerator({x: halfWidth, y: halfHeight, fontSize: 80, anchor: anchorCenter, text: 'Time\'s up', opacity: 0}),
            instructions = textObjectGenerator({
                text: 'Press \'space\' to restart',
                x: halfWidth, y: props.height - 100, color: 'grey', fontSize: 16,
                opacity: 0,
                anchor: { x: .5, y: .5 }
            })
    
    const bloodBurst = new Array(50).fill(null).map(i => poolGenerator({
            maxSize: 10,
            get: () => ({
                x: player.x,
                y: player.y + 60,
                dx: (2 - Math.random() * 4) * 2,
                dy: 1 - (Math.random() * 1.5) + .5,
                color: 'red',
                width: spriteScale,
                height: spriteScale,
                ttl: [10, 14, 18][randInt(0, 2)]
            })
        })
    )

    const scene = new Scene({
        id: 'game',
        objects: [
            ...walls, ...roosters, wallBrick, ceiling, carpetBrick, ...carpetRepeatables, backgroundStart, ...backgroundRepeatables,
            ...candleImages,
            ...men, ...women, player,
            ...bloodBurst.map(blood => blood.pool.objects).flat(),
            pointsText // timerText
        ],
        width: sceneWidth,
        height: props.height
    });

    const blinkingStars = createBlinkingStars(50, scene, { x: 5, y: 5 }, { x: props.width - 5, y: 115 })
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const startGameplay = () => {
        // gameEndTime = Date.now() + (playTime * 1000)
        timerStarted = true
        inputHelper.init()
        inputHelper.on('Space', () => player.setWinking(true))
        inputHelper.on('ArrowRight', null, () => player.setMoveDirection(0))
        inputHelper.on('ArrowLeft', null, () => player.setMoveDirection(0))
    }

    preStartText.text = ''
    setTimeout(async () => {
        preStartText.text = '1'
        await sleep(1000)
        preStartText.text = '2'
        await sleep(1000)
        preStartText.text = '3'
        await sleep(1000)
        preStartText.text = 'SEDUCE!'
        startGameplay()
        await sleep(1000)
        preStartText.text = ''
    }, 500)

    let killerOfPlayer = null
    // let timesUp = false

    function checkIsGoalReached () {
        return points >= men.length
    }

    function stopGameInteractionsScreen () {
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        player.setMoveDirection(0)
        ;[...men, ...women.filter(_woman => _woman !== killerOfPlayer)].forEach(obj => obj.clearCycle())
      
        killerOfPlayer && player.currentAnimation?.stop?.()
        setTimeout(() => {
            instructions.opacity = 1
            inputHelper.on('Space', () => { 
                loadScene(scene, props.sceneSetupsList.game)
            })
        }, 1000)
    }

    const loop = new GameLoop({  // create the main game loop
        update () { // update the game state
            const maxPriorityKey = inputHelper.getMaxPriorityPressedButton(['ArrowRight', 'ArrowLeft'])
            if (!checkIsGoalReached() && !killerOfPlayer && maxPriorityKey && timerStarted) { // !timesUp && 
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
                            if (prevLoveLevel < 3 && man._loveLevel === 3) {
                                points++
                                checkIsGoalReached() && stopGameInteractionsScreen()
                            }
                        }
                    })
                player.setWinking(false)
            }

            women
                .filter(woman => woman.isAdrenalined())
                .forEach(woman => woman.setTargetX(player.x))

            player?.update(scene)
            men.forEach(woman => woman.update())
            women.forEach(woman => woman.update())

            // Points
            pointsText.text = `LOVERS ATTRACTED: ${points}/${men.length}`
            pointsText.x = 50 + scene.camera.x - scene.camera.width/2

            // Timer
            // if (timerStarted && gameEndTime) {
            //     const timeLeft = Math.floor((gameEndTime - Date.now()) / 1000)
            //     timerText.text = `TIME LEFT: ${timeLeft < 0 ? 0 : timeLeft} s`
            //     if (timeLeft <= 0 && !killerOfPlayer) {
            //         timesUp = true
            //         stopGameInteractionsScreen()
            //     }
            // } else {
            //     timerText.text = `TIME LEFT: -`
            // }
            // timerText.x = 50 + scene.camera.x - scene.camera.width/2

            women.forEach(woman => {
                if (
                    woman.isAdrenalined() &&
                    woman.x + woman.width >= player.x - player.width &&
                    woman.x - woman.width <= player.x + player.width &&
                    !killerOfPlayer
                ) {
                    killerOfPlayer = woman
                    stopGameInteractionsScreen()
                }
            })
            // When player failed -> run end screen
            if (!checkIsGoalReached() && killerOfPlayer) { //  || timesUp
                if (killerOfPlayer) {
                    bloodBurst.forEach(blood => blood.update())
                }
                scene.objects.filter(o => o !== killerOfPlayer && o !== player).forEach(sprite => {
                    sprite.opacity = lerp(sprite.opacity, 0, 0.05)
                    sprite.children.forEach(c => c.opacity = 0)
                })
                if (backgroundStart.opacity < 0.01) {
                    if (killerOfPlayer) {
                        killedText.opacity = lerp(killedText.opacity, 1, 0.005)
                    } else {
                        timeOverText.opacity = lerp(timeOverText.opacity, 1, 0.005)
                    }
                }
            }
            // When player reached the goal
            if (checkIsGoalReached()) {
                
                player.setMoveDirection(-1)
                
                const hasUncollectedMen = men.filter(man => man.opacity === 1)?.length > 0

                if (hasUncollectedMen) {
                    // Collect men
                    men.forEach(man => {
                        if (man.scaleX < 0.01) {
                            man.opacity = 0
                            return
                        }
                        man.children.forEach(c => c.opacity = 0)
                        let lerpSpeed = parseFloat( (1 / Math.abs(Math.abs(man.x) - Math.abs(player.x))) )
                        if (!lerpSpeed) { lerpSpeed = 0.01}
                        lerpSpeed *= 4

                        man.x = lerp(man.x, player.x, lerpSpeed)
                        man.y = lerp(man.y, player.y + player.height * 2, lerpSpeed)
                        man.scaleX = lerp(man.scaleX, 0, lerpSpeed / 2)
                        man.scaleY = lerp(man.scaleY, 0, lerpSpeed / 2)
                    })
                } else {
                    player.activateAdrenaline()
                }
                if (player.x <= 200) {
                    scene.objects.forEach(sprite => {
                        sprite.opacity = lerp(sprite.opacity, 0, 0.05)
                        sprite.children.forEach(c => c.opacity = 0)
                    })
                    if (backgroundStart.opacity < 0.01) {
                        winText.opacity = lerp(winText.opacity, 1, 0.005)
                    }
                }
                
            }
        },
        render () { // render the game state
            scene.render()
            drawLine(scene, {x: 0, y: 115}, {x: props.width, y: 115}, 10)
            ;[blinkingStars, preStartText, preStartText, winText, killedText, timeOverText, instructions].forEach(o => o?.render())
        }
    })

    scene.beforeDestroy = () => {
        loop.stop()
        blinkingStars.destroy()
        bloodBurst.forEach(bloodContainer => bloodContainer.destroy())
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        ;[...men, ...women].forEach(obj => obj.clearCycle())
        scene.remove([...scene.objects, preStartText])
    }

    return {loop, scene}
}