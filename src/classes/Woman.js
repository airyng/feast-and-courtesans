import NPC from './NPC'
import sprites from '../spritesMap'
import { imageAssets, Sprite } from 'kontra'

export default class Man extends NPC {

    _loveLevel = 0

    constructor (properties) {
        super(properties)
        const ragedEyes = new Sprite({ image: imageAssets[sprites.rage], x: -3, y: 10, opacity: 0 })
        this.addChild(ragedEyes)
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