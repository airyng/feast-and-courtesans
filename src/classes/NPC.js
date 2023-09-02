import { SpriteClass, randInt } from 'kontra'

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
            anchor: {x: 0.5, y: 0},
            width: 70,
            height: 120,
            scaleX: Math.random() > .5 ? 1 : -1,
            color: properties.color || 'black'
        })
        this.addChild(new SpriteClass({
            x: 25,
            y: 15,
            // required for a rectangle sprite
            width: 5,
            height: 5,
            color: 'black'
        }))
        this._startX = properties.x

        setInterval(() => {
            if (this.targetX) { return }

            this.scaleX *= -1

        }, randInt(5, 10) * 1000)
    }

    setTargetX (targetX) {
        this._targetX = targetX
    }

    moveTo (targetX) {
        const direction = targetX > this.x ? 1 : -1
        this.dx = direction * this._speed
        // Sprite flip
        this.scaleX = this.dx < 0 ? -1 : 1
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
        const min = Math.min(this.x, this.x + this._viewLength * this.scaleX)
        const max = Math.max(this.x, this.x + this._viewLength * this.scaleX)
        return targetX >= min && targetX <= max
    }

    update () {
        // if (parseInt(Date.now() / 1000) % 5 === 0) {
        //     console.log('flip')
        // }
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
  }