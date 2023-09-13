import { Scene, Sprite, randInt, GameLoop, lerp } from 'kontra'
import Player from '../classes/Player'
import Man from '../classes/Man'
import Woman from '../classes/Woman'
import input from '../helpers/inputHelper'
import { textObjectGenerator as txtGen, poolGenerator } from '../helpers/gameObjectGenerator'
import { createBlinkingStars, drawLine, cropImage } from '../helpers/graphicsHelper'

const keepFollowingPlayerInSec = 4
const spriteScale = 3
// const playTime = 60 * 3
const colorRed = '#b20116'

export default async function setup (props, loadScene) {
    const   mainSS = props.mainSS,
            backgroundRepeatableImage = await cropImage(mainSS, 0, 0, 256, 32),
            candleImage = await cropImage(mainSS, 256, 0, 29, 36),
            wallImage = await cropImage(mainSS, 285, 0, 8, 52),
            carpet2Image = await cropImage(mainSS, 156, 32, 10, 13),
            carpet1Image = await cropImage(mainSS, 166, 32, 10, 8),
            roosterImage = await cropImage(mainSS, 190, 32, 40, 19),
            whitePatternImage = await cropImage(mainSS, 230, 32, 26, 18),
            anchorCenter = {x: 0.5, y: 0.5},
            hw = props.width / 2,
            hh = props.height / 2
    let points = 0,
        timerStarted = false
        // gameEndTime = null
    const   candleImages = [116, 460, 814, 1230, 1580, 2000, 2350, 2762, 3120, 3372].map(x => new Sprite({ x, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: candleImage })),
            // backgroundStart = new Sprite({ x: 0, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: backgroundStartImage }),
            backgroundRepeatables = new Array(4).fill(null).map((item, i) => new Sprite({ x: (i * backgroundRepeatableImage.width * spriteScale), y: 480, scaleX: spriteScale, scaleY: spriteScale, image: backgroundRepeatableImage })),
            carpetRepeatables = [carpet1Image, carpet2Image].map((image, imageI) => new Array(120).fill(null).map((item, i) => new Sprite({ x: (i * image.width * spriteScale), y: imageI ? 682 : 630, scaleX: spriteScale, scaleY: spriteScale, image }))).flat(),
            walls = new Array(130).fill(null).map((item, i) => new Sprite({ x: i * wallImage.width * spriteScale, y: 207, scaleX: spriteScale, scaleY: spriteScale, image: wallImage })),
            roosters = new Array(110).fill(null).map((item, i) => new Sprite({ x: ((i * roosterImage.width * spriteScale)), y: 387, scaleX: spriteScale, scaleY: spriteScale, image: roosterImage })),
            whitePatterns = new Array(110).fill(null).map((item, i) => new Sprite({ x: ((i * whitePatternImage.width * spriteScale)), y: 576, scaleX: spriteScale, scaleY: spriteScale, image: whitePatternImage })),
            ceiling = new Sprite({ x: 0, y: 110, color: '#8d8688', width: 3072, height: 97 }),
            wallBrick = new Sprite({ x: 0, y: 234, color: colorRed, width: 3500, height: 325 }),
            // wallBrick2 = new Sprite({ x: 0, y: 444, color: colorRed, width: 3500, height: 36 }),
            carpetBrick = new Sprite({ x: 0, y: 652, color: colorRed, width: 3500, height: 30 }),
            sceneWidth = backgroundRepeatableImage.width * backgroundRepeatables.length * spriteScale,
            p = new Player({ x: 300, y: props.height - 250 + 6, animations: props.spriteSheets.playerSpritesheet.animations, scale: spriteScale, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } }),
            men = Array(8).fill(null).map((item, i) => new Man({ x: 390 * (i + 1), y: props.height - 250, animations: props.spriteSheets.men1Spritesheet.animations, scale: spriteScale })),
            women = Array(8).fill(null).map((item, i) => new Woman({ x: (390 * (i + 1)) + 100, y: props.height - 250 + 6, animations: props.spriteSheets.womenSpritesheet.animations, scale: spriteScale, viewLength: 500 })),
            // timerText = txtGen({x: 50, y: 40}),
            pointsText = txtGen({x: 50, y: 80}),
            preStartText = txtGen({x: hw, y: 65, fontSize: 80, anchor: anchorCenter}),
            killedText = txtGen({x: hw, y: hh, fontSize: 80, anchor: anchorCenter, text: 'You\'re dead', opacity: 0}),
            winText = txtGen({x: hw, y: hh, fontSize: 80, anchor: anchorCenter, text: 'All the boyars are seduced 😜', opacity: 0}),
            timeOverText = txtGen({x: hw, y: hh, fontSize: 80, anchor: anchorCenter, text: 'Time\'s up', opacity: 0}),
            instructions = txtGen({
                text: 'Press \'space\' to restart',
                x: hw, y: props.height - 100, color: 'grey', fontSize: 16,
                opacity: 0,
                anchor: { x: .5, y: .5 }
            })
    
    const bloodBurst = new Array(50).fill(null).map(i => poolGenerator({
            maxSize: 10,
            get: () => ({
                x: p.x,
                y: p.y + 60,
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
            wallBrick, ...walls, ...roosters, ceiling, ...whitePatterns, carpetBrick, ...carpetRepeatables, ...backgroundRepeatables, // backgroundStart, 
            ...candleImages,
            ...men, ...women, p,
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
        input.init()
        input.on('Space', () => p.setWinking(true))
        input.on('ArrowRight', null, () => p.setMoveDirection(0))
        input.on('ArrowLeft', null, () => p.setMoveDirection(0))
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
        input.off('Space')
        input.off('ArrowRight')
        input.off('ArrowLeft')
        p.setMoveDirection(0)
        ;[...men, ...women.filter(w => w !== killerOfPlayer)].forEach(obj => obj.clearCycle())
      
        killerOfPlayer && p.currentAnimation?.stop?.()
        setTimeout(() => {
            instructions.opacity = 1
            input.on('Space', () => { 
                loadScene(scene, props.sceneSetupsList.game)
            })
        }, 1000)
    }

    const loop = new GameLoop({  // create the main game loop
        update () { // update the game state
            const maxPriorityKey = input.getMaxPriorityPressedButton(['ArrowRight', 'ArrowLeft'])
            if (!checkIsGoalReached() && !killerOfPlayer && maxPriorityKey && timerStarted) { // !timesUp && 
                p.setMoveDirection(maxPriorityKey === 'ArrowLeft' ? -1 : 1)
            }

            if (p.isWinking()) {
                women.forEach(w => {
                        if (w.checkIsPointInView(p.x) && w.scaleX !== p.scaleX) {
                            w.activateAdrenaline(keepFollowingPlayerInSec)
                            p.activateAdrenaline(keepFollowingPlayerInSec)
                        }
                    })

                men.forEach(man => {
                        if (man.checkIsPointInView(p.x) && man.scaleX !== p.scaleX) {
                            const prevLoveLevel = man._loveLevel
                            man.increaseLoveLevel()
                            if (prevLoveLevel < 3 && man._loveLevel === 3) {
                                points++
                                checkIsGoalReached() && stopGameInteractionsScreen()
                            }
                        }
                    })
                p.setWinking(false)
            }

            women
                .filter(w => w.isAdrenalined())
                .forEach(w => w.setTargetX(p.x))

            p?.update(scene)
            men.forEach(w => w.update())
            women.forEach(w => w.update())

            // Points
            pointsText.text = `BOYARS ATTRACTED: ${points}/${men.length}`
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

            women.forEach(w => {
                if (
                    w.isAdrenalined() &&
                    w.x + w.width >= p.x - p.width &&
                    w.x - w.width <= p.x + p.width &&
                    !killerOfPlayer
                ) {
                    killerOfPlayer = w
                    stopGameInteractionsScreen()
                }
            })
            // When player failed -> run end screen
            if (!checkIsGoalReached() && killerOfPlayer) { //  || timesUp
                if (killerOfPlayer) {
                    bloodBurst.forEach(blood => blood.update())
                }
                scene.objects.filter(o => o !== killerOfPlayer && o !== p).forEach(sprite => {
                    sprite.opacity = lerp(sprite.opacity, 0, 0.05)
                    sprite.children.forEach(c => c.opacity = 0)
                })
                if (backgroundRepeatables[0].opacity < 0.01) {
                    if (killerOfPlayer) {
                        killedText.opacity = lerp(killedText.opacity, 1, 0.005)
                    } else {
                        timeOverText.opacity = lerp(timeOverText.opacity, 1, 0.005)
                    }
                }
            }
            // When player reached the goal
            if (checkIsGoalReached()) {
                
                p.setMoveDirection(-1)
                
                const hasUncollectedMen = men.filter(man => man.opacity === 1)?.length > 0

                if (hasUncollectedMen) {
                    // Collect men
                    men.forEach(man => {
                        if (man.scaleX < 0.01) {
                            man.opacity = 0
                            return
                        }
                        man.children.forEach(c => c.opacity = 0)
                        let lerpSpeed = parseFloat( (1 / Math.abs(Math.abs(man.x) - Math.abs(p.x))) )
                        if (!lerpSpeed) { lerpSpeed = 0.01}
                        lerpSpeed *= 4

                        man.x = lerp(man.x, p.x, lerpSpeed)
                        man.y = lerp(man.y, p.y + p.height * 2, lerpSpeed)
                        man.scaleX = lerp(man.scaleX, 0, lerpSpeed / 2)
                        man.scaleY = lerp(man.scaleY, 0, lerpSpeed / 2)
                    })
                } else {
                    p.activateAdrenaline()
                }
                if (p.x <= 200) {
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
        input.off('Space')
        input.off('ArrowRight')
        input.off('ArrowLeft')
        ;[...men, ...women].forEach(obj => obj.clearCycle())
        scene.remove([...scene.objects, preStartText])
    }

    return {loop, scene}
}