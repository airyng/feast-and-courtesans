import { Scene, Sprite, randInt, imageAssets, GameLoop, GameObject } from 'kontra'
import Player from '../classes/Player'
import Man from '../classes/Man'
import Woman from '../classes/Woman'
import inputHelper from '../helpers/inputHelper'
import { textObjectGenerator, poolGenerator } from '../helpers/gameObjectGenerator'


const keepFollowingPlayerInSec = 5
const spriteScale = 3

const createBackWink = function (x, y) {
    const _backWink = new GameObject({ x, y })
    const eyes = new Array(2).fill(null).map((item, index) => new Sprite({
        x: 12 * index,
        y: 0,
        width: 2,
        height: 1,
        scaleX: spriteScale,
        scaleY: spriteScale,
        color: '#e3c997', //'black', // '#e3c997',
        opacity: 0
    }))
    _backWink.addChild(eyes)

    function endWink () {
        if (!_backWink.isAlive()) { return; }
        setTimeout(() => {
            _backWink.children.forEach(child => {
                child.opacity = 0
            })
            startWink()
        }, 150)
    }

    function startWink () {
        if (!_backWink.isAlive()) { return; }
        setTimeout(() => {
            _backWink.children.forEach(child => {
                child.opacity = 1
            })
            endWink()
        }, 3000)
    }

    setTimeout(endWink, parseInt(5000 * Math.random()))

    return _backWink
}

const createCandlesSparks = (x) => {
    const pools = []
    for (let index = 0; index < 5; index++) {
        
        pools.push(
            poolGenerator({
                maxSize: [0, 1, 2][randInt(0, 2)],
                get: () => ({
                    x: x + (index * 15),
                    y: 180,
                    dx: (-Math.random()*2 + 1) / 10,
                    dy: -1 / 10,
                    color: ['#e6e583', '#d3bb06', '#ffffd5'][randInt(0, 2)],
                    width: spriteScale,
                    height: spriteScale,
                    ttl: [100, 140, 180][randInt(0, 2)]
                })
            })
        )
    }
    return pools
}

export default async function setup (props) {
    let points = 0,
        timerStarted = false,
        gameEndTime = null

    const backgroundStart = new Sprite({ x: 0, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.backgroundStart] })
    const backgroundRepeatables = new Array(4).fill(null).map((item, index) => new Sprite({ x: (84 * spriteScale) + (index * imageAssets[props.sprites.backgroundRepeatable].width * spriteScale), y: 120, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.backgroundRepeatable] }))
    const sceneWidth = imageAssets[props.sprites.backgroundStart].width * spriteScale + (imageAssets[props.sprites.backgroundRepeatable].width * backgroundRepeatables.length * spriteScale) + imageAssets[props.sprites.backgroundEnd].width * spriteScale
    const backgroundEnd = new Sprite({ x: sceneWidth - imageAssets[props.sprites.backgroundEnd].width * spriteScale, y: 120, scaleX: spriteScale, scaleY: spriteScale, image: imageAssets[props.sprites.backgroundEnd] })
    const player = new Player({ x: 300, y: props.height - 250 + 6, animations: props.spriteSheets.playerSpritesheet.animations, scale: spriteScale, extraAnimations: { winking: props.spriteSheets.winkingSpritesheet.animations } })
    const men = Array(8).fill(null).map((item, index) => new Man({ x: 400 * (index + 1), y: props.height - 250, animations: props.spriteSheets[`men${randInt(1, 2)}Spritesheet`].animations, scale: spriteScale }))
    const women = Array(8).fill(null).map((item, index) => new Woman({ x: (400 * (index + 1)) + 100, y: props.height - 250 + 6, animations: props.spriteSheets.womenSpritesheet.animations, scale: spriteScale, viewLength: 500 }))

    const timerText = textObjectGenerator()
    const pointsText = textObjectGenerator({x: 50, y: 100})
    const preStartText = textObjectGenerator({x: props.width / 2, y: props.height / 2 - 200, font: '80px cursive, Arial', anchor: {x: 0.5, y: 0.5}})
    

    const backWinksPositions = [ {x: 210, y: props.height - 284} ]
    
    for (let i = 0; i < 4; i++) {
        [
            {x: 363, y: props.height - 284},
            {x: 420, y: props.height - 293},
            {x: 534, y: props.height - 296},
            {x: 606, y: props.height - 287},
            {x: 681, y: props.height - 296},
            {x: 798, y: props.height - 296},
            {x: 978, y: props.height - 300}
        ].forEach(o => {
            backWinksPositions.push({ x: o.x + ((imageAssets[props.sprites.backgroundRepeatable].width * spriteScale) * i), y: o.y })
        })
    }
    [
        {x: 60 + 978 + ((imageAssets[props.sprites.backgroundRepeatable].width * spriteScale) * 3), y: props.height - 290},
        {x: 153 + 978 + ((imageAssets[props.sprites.backgroundRepeatable].width * spriteScale) * 3), y: props.height - 266},
    ].forEach(o => { backWinksPositions.push(o) })
    
    const backWinks = backWinksPositions.map(o => createBackWink(o.x, o.y))
    
    const candles = [130, 470, 825, 1240, 1590, 2010, 2360, 2775, 3130, 3385].map(x => createCandlesSparks(x))

    const scene = new Scene({
        id: 'game',
        objects: [
            backgroundStart, ...backgroundRepeatables, backgroundEnd,
            ...backWinks,
            ...candles.map(candle => candle.map(poolContainer => poolContainer.pool.objects).flat()).flat(),
            ...men, ...women, player,
            timerText, pointsText
        ],
        width: sceneWidth,
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

            candles.forEach(candle => candle.forEach(poolContainer => {
                poolContainer.update()
            }))
        },
        render () { // render the game state
            scene.render()
            preStartText.render()
        }
    })

    scene.beforeDestroy = () => {
        loop.stop()
        candles.forEach(candle => candle.forEach(poolContainer => poolContainer.pool.destroyPool()))
        inputHelper.off('Space')
        inputHelper.off('ArrowRight')
        inputHelper.off('ArrowLeft')
        ;[...man, ...woman].forEach(obj => obj.clearCycle())
        scene.remove([...scene.objects, preStartText])
    }

    return {loop, scene}
}