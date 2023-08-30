import { SpriteClass } from 'kontra'

export default class Man extends SpriteClass {

    constructor(properties) {
        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            width: 70,
            height: 120,
            dx: 0,
            dy: 0,
            color: 'blue'
        })
    }
  
    draw() {
        super.draw()
    }
  }