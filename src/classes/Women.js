import { SpriteClass, emit } from 'kontra'

export default class Women extends SpriteClass {

    speed = 8.2

    _targetX = null
    _startX = null

    constructor (properties) {

        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            width: 70,
            height: 120,
            dx: 0,
            dy: 0,
            color: 'pink'
        })
        this._startX = properties.x
    }

    setTargetX (targetX) {
        this._targetX = targetX
    }

    moveTo (targetX) {
        const direction = targetX > this.x ? 1 : -1
        this.dx = direction * this.speed
    }

    stopMoving () {
        this._targetX = null
        this.dx = 0
    }

    update () {
        // Check is target reached
        if (this._targetX !== null && Math.abs(this.x - this._targetX) <= this.dx) {
            if (this._targetX === this._startX) { this.stopMoving() }
            else { this.setTargetX(this._startX) }
        }
        // Move to target if exists
        this._targetX !== null && this.moveTo(this._targetX)

        super.update()
    }
  
    draw () {
        super.draw()
    }
  }