import { SpriteClass, randInt } from 'kontra'

const maxLoveLevel = 3

export default class NPC extends SpriteClass {

    _speed = 3.1
    _targetX = null
    _startX = null
    _initialScale = 1
    _adrenalineMode = false
    _adrenalineTimeLimit = false
    _viewLength = 300
    _loveLevel = 0

    constructor (properties) {

        const scaleX = (properties.scale || 1) * (Math.random() > .5 ? 1 : -1)

        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            anchor: {x: 0.5, y: 0},
            scaleX,
            scaleY: properties.scale || 1,
            image: properties.image
        })
        this._viewLength = properties.viewLength || 300
        this._startX = properties.x
        this._initialScale = scaleX

        setInterval(() => {
            if (this.targetX) { return }
            console.log('flip', this.targetX)
            this.scaleX *= -1
        }, randInt(5, 10) * 1000)
    }

    increaseLoveLevel (value = 1) {
        this._loveLevel += value
        if (this._loveLevel > maxLoveLevel) {
            this._loveLevel = maxLoveLevel
        }
    }

    setTargetX (targetX) {
        this._targetX = targetX
    }

    stopMoving () {
        this._targetX = null
        this.dx = 0
    }

    moveTo (targetX) {
        const direction = targetX > this.x ? 1 : -1
        this.dx = direction * this._speed
        // Sprite flip
        this.scaleX = Math.abs(this._initialScale) * direction
        console.log(this.dx)
    }

    activateAdrenaline (adrenalineDuration = 1) {
        this._adrenalineMode = true
        this._speed *= 2
        this._adrenalineTimeLimit = (adrenalineDuration * 1000) + Date.now()
    }

    deactivateAdrenaline () {
        this._adrenalineMode = false
        this._speed /= 2
        this._adrenalineTimeLimit = 0
    }

    isAdrenalined () {
        return !!this._adrenalineMode
    }

    checkIsPointInView (targetX) {
        const dir = this.scaleX > 0 ? 1 : -1
        const min = Math.min(this.x, this.x + this._viewLength * dir)
        const max = Math.max(this.x, this.x + this._viewLength * dir)
        return targetX >= min && targetX <= max
    }

    update () {
        if (this._adrenalineMode && this._adrenalineTimeLimit <= Date.now()) { this.deactivateAdrenaline() }

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