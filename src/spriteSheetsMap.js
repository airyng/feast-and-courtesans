import { SpriteSheet, imageAssets } from 'kontra'
import sprites from './spritesMap'

export default {

    men1Spritesheet: new SpriteSheet({
        image: imageAssets[sprites.menSpritesheet],
        frameWidth: 20,
        frameHeight: 40,
        animations: {
            idle: { frames: 0 },
            sip: {
                frames: [0, 1, 0],
                frameRate: 1,
                loop: false
            }
        }
    }),
    men2Spritesheet: new SpriteSheet({
        image: imageAssets[sprites.menSpritesheet],
        frameWidth: 20,
        frameHeight: 40,
        animations: {
            idle: { frames: 2 },
            sip: {
                frames: [2, 3, 2],
                frameRate: 1,
                loop: false
            }
        }
    }),
    playerSpritesheet: new SpriteSheet({
        image: imageAssets[sprites.womenSpritesheet],
        frameWidth: 30,
        frameHeight: 40,
        animations: {
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
        }
    }),
    womenSpritesheet: new SpriteSheet({
        image: imageAssets[sprites.womenSpritesheet],
        frameWidth: 30,
        frameHeight: 40,
        animations: {
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
        }
    }),
    winkingSpritesheet: new SpriteSheet({
        image: imageAssets[sprites.winkingSpritesheet],
        frameWidth: 7,
        frameHeight: 14,
        animations: {
            wink: {
                frames: [0, 1],
                frameRate: 10,
                loop: false
            }
        }
    })
}