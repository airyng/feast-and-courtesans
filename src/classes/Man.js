import NPC from './NPC'
import { mainSS } from '../spriteSheetsMap'
import { Sprite } from 'kontra'
import { cropImage } from '../helpers/graphicsHelper'

const maxLoveLevel = 3

export default class Man extends NPC {

    _loveLevel = 0

    constructor (properties) {
        super(properties)
        const that = this
        ;(async function () {
            const heartImage = await cropImage(mainSS, 176, 32, 7, 6)
            const createHeart = (x = 0, y = -10) => new Sprite({ image: heartImage, x, y, opacity: 0, anchor: { x: 0.5, y: 0 } })

            that.addChild(
                createHeart(heartImage.width / 2 - 5),
                createHeart((heartImage.width / 2) - (heartImage.width + 1) - 5),
                createHeart((heartImage.width / 2) - (heartImage.width + 1) / 2 - 5, -17),
            )
        })()
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