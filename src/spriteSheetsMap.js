import { SpriteSheet } from 'kontra'
// import sprites from './spritesMap'
import { cropImage } from './helpers/graphicsHelper'

function loadSS () {
    return new Promise(resolve => {
        const image = new Image ()
        image.onload = () => { resolve(image) }
        image.src = require('./assets/images/spritesheets/main.png')
    })
}

const mainSS = await loadSS()

const winkingImage = await cropImage(mainSS, 142, 32, 14, 7)
const menImage = await cropImage(mainSS, 480, 0, 20, 40)
const womenImage = await cropImage(mainSS, 293, 0, 180, 37)

const genSS = (fw, fh, animations, image) => new SpriteSheet({
    image: image,
    frameWidth: fw,
    frameHeight: fh,
    animations
})

export { mainSS }

export default {
    men1Spritesheet: genSS( 32, 40, { idle: { frames: 0 } }, menImage),
    // men2Spritesheet: genSS('menSpritesheet', 20, 40, { idle: { frames: 2 } }),
    playerSpritesheet: genSS(30, 38, {
        idle: {
            frames: [0, 1],
            frameRate: 0.5
        },
        walk: {
            frames: [0, 1],
            frameRate: 2
        },
        run: {
            frames: [0, 1, 1],
            frameRate: 8
        }
    }, womenImage),
    womenSpritesheet: genSS(30, 38, {
        idle: {
            frames: [2, 3],
            frameRate: 0.5
        },
        walk: {
            frames: [2, 3],
            frameRate: 2
        },
        run: {
            frames: [4, 5],
            frameRate: 8
        }
    }, womenImage),
    winkingSpritesheet: genSS(7, 14, {
        wink: {
            frames: [0, 1],
            frameRate: 10,
            loop: false
        }
    }, winkingImage),
}