import { SpriteClass } from 'kontra'

export default class Player extends SpriteClass {

    speed = 8

    constructor(properties) {
        super({
            x: 300,
            y: properties.height - 250,
            // required for a rectangle sprite
            width: 70,
            height: 120,
            dx: 0,
            dy: 0,
            color: 'red'
        })
    }
  
    draw() {
        super.draw()
    }

    movementUpdate (moveDirection, background, movementBounds, width) {
        this.dx = moveDirection * this.speed
        background.dx = 0
        
        if (this.dx < 0 && this.x <= movementBounds.left) {
            this.x = movementBounds.left
            if (background.x < 0) {
                background.dx = -this.dx
            }
        }
        if (this.dx > 0 && this.x >= width - movementBounds.right - this.width) {
            if (background.width - width > -background.x) {
                background.dx = -this.dx
            }
            this.x = width - movementBounds.right - this.width
        }
    }
  }