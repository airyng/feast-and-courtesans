import { SpriteSheet, imageAssets } from 'kontra'
import sprites from './spritesMap'

const genSS = (ssName, fw, fh, animations) => new SpriteSheet({
    image: imageAssets[sprites[ssName]],
    frameWidth: fw,
    frameHeight: fh,
    animations
})

export default {
    men1Spritesheet: genSS('menSpritesheet', 32, 40, { idle: { frames: 0 } }),
    men2Spritesheet: genSS('menSpritesheet', 20, 40, { idle: { frames: 2 } }),
    playerSpritesheet: genSS('womenSpritesheet', 30, 38, {
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
    }),
    womenSpritesheet: genSS('womenSpritesheet', 30, 38, {
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
    }),
    winkingSpritesheet: genSS('winkingSpritesheet', 7, 14, {
        wink: {
            frames: [0, 1],
            frameRate: 10,
            loop: false
        }
    }),
}