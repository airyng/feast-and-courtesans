import { SpriteSheet, imageAssets } from 'kontra'
import sprites from './spritesMap'

const generateSpriteSheet = (ssName, fw, fh, animations) => new SpriteSheet({
    image: imageAssets[sprites[ssName]],
    frameWidth: fw,
    frameHeight: fh,
    animations
})

export default {
    men1Spritesheet: generateSpriteSheet('menSpritesheet', 20, 40, {
        idle: { frames: 0 },
        sip: {
            frames: [0, 1, 0],
            frameRate: 1,
            loop: false
        }
    }),
    men2Spritesheet: generateSpriteSheet('menSpritesheet', 20, 40, {
        idle: { frames: 2 },
        sip: {
            frames: [2, 3, 2],
            frameRate: 1,
            loop: false
        }
    }),
    playerSpritesheet: generateSpriteSheet('womenSpritesheet', 30, 38, {
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
    womenSpritesheet: generateSpriteSheet('womenSpritesheet', 30, 38, {
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
    winkingSpritesheet: generateSpriteSheet('winkingSpritesheet', 7, 14, {
        wink: {
            frames: [0, 1],
            frameRate: 10,
            loop: false
        }
    }),
}