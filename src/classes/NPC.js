import { SpriteClass } from 'kontra'

export default class NPC extends SpriteClass {

    _speed = 8.2
    _targetX = null
    _startX = null
    _rageMode = false
    _rageTimeLimit = false
    _viewLength = 300
    _loveLevel = 0

    constructor (properties) {

        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            width: 70,
            height: 120,
            dx: 0,
            dy: 0,
            color: properties.color || 'black'
        })

        this._startX = properties.x
    }

    setTargetX (targetX) {
        this._targetX = targetX
    }

    moveTo (targetX) {
        const direction = targetX > this.x ? 1 : -1
        this.dx = direction * this._speed
    }

    activateRage (rageDuration = 1) {
        this._rageMode = true
        this._rageTimeLimit = (rageDuration * 1000) + Date.now()
    }

    deactivateRage () {
        this._rageMode = false
        this._rageTimeLimit = 0
    }

    isRaged () {
        return !!this._rageMode
    }

    stopMoving () {
        this._targetX = null
        this.dx = 0
    }

    checkIsPointInView (targetX) {
        const x = this.scaleX > 0 ? this.x + this.width : this.x
        return targetX >= x && targetX <= (x + this._viewLength)
    }

    update () {
        
        if (this._rageMode && this._rageTimeLimit <= Date.now()) { this.deactivateRage() }

        // Check is target reached
        if (this._targetX !== null && Math.abs(this.x - this._targetX) <= this.dx) {
            // If target is initial position - stop moving
            if (this._targetX === this._startX) { this.stopMoving() }
            // Set new target that is initial position
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