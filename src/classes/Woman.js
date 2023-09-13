import NPC from './NPC'
// import sprites from '../spritesMap'
import { Sprite } from 'kontra'
import { cropImage } from '../helpers/graphicsHelper'
import { mainSS } from '../spriteSheetsMap'

export default class Man extends NPC {

    _loveLevel = 0

    constructor (properties) {
        super(properties)

        const that = this
        ;(async function () {
            
            const ragedEyesImage = await cropImage(mainSS, 183, 32, 7, 3)
            const ragedEyes = new Sprite({ image: ragedEyesImage, x: -3, y: 6, opacity: 0 })
            that.addChild(ragedEyes)
        })()
    }
    
    activateAdrenaline (prop) {
        super.activateAdrenaline(prop)
        this.children[0].opacity = 1
    }

    deactivateAdrenaline () {
        super.deactivateAdrenaline()
        this.children[0].opacity = 0
    }
}