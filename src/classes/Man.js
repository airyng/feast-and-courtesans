import NPC from './NPC'
import sprites from '../spritesMap'
import { imageAssets, Sprite } from 'kontra'

const maxLoveLevel = 3

export default class Man extends NPC {

    _loveLevel = 0

    constructor (properties) {
        super(properties)
        const createHeart = (x = 0, y = -10) => new Sprite({ image: imageAssets[sprites.heart], x, y, opacity: 0, anchor: { x: 0.5, y: 0 } })
        this.addChild(
            createHeart(imageAssets[sprites.heart].width / 2),
            createHeart((imageAssets[sprites.heart].width / 2) - (imageAssets[sprites.heart].width + 1)),
            createHeart((imageAssets[sprites.heart].width / 2) - (imageAssets[sprites.heart].width + 1) / 2, -17),
        )
    }
    
    increaseLoveLevel (value = 1) {
        this._loveLevel += value
        if (this._loveLevel > maxLoveLevel) {
            this._loveLevel = maxLoveLevel
        }
        for (let index = 1; index <= this._loveLevel; index++) {
            this.children[index - 1].opacity = 1
        }
    }

    onFlipped () {
        this.children.forEach(child => { child.scaleX *= -1 } )
    }
}