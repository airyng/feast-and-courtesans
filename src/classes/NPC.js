import { SpriteClass, randInt } from 'kontra'

export default class NPC extends SpriteClass {

    _maxSpeed = 3
    _speed = 0
    _targetX = null
    _startX = null
    _initialScale = 1
    _adrenalineMode = false
    _adrenalineTimeLimit = false
    _viewLength = 300

    constructor (properties) {

        const scaleX = (properties.scale || 1) * (Math.random() > .5 ? 1 : -1)
        const attrs = {}
        if (properties.image) { attrs.image = properties.image }
        if (properties.animations) { attrs.animations = properties.animations }
        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            anchor: {x: 0.5, y: 0},
            scaleX,
            scaleY: properties.scale || 1,
            ...attrs
        })
        this._viewLength = properties.viewLength || 300
        this._startX = properties.x
        this._initialScale = scaleX
        this._speed = this._maxSpeed

        setInterval(() => {
            if (this.targetX) { return }
            this.scaleX *= -1
            this.animations?.sip && this.playAnimation('sip')
            this.onFlipped?.()
        }, randInt(5, 10) * 1000)
    }

    setTargetX (targetX) {
        this._targetX = targetX
    }

    stopMoving () {
        this._targetX = null
        this.dx = 0
        this.animations?.idle && this.playAnimation('idle')
    }

    moveTo (targetX) {
        const direction = targetX > this.x ? 1 : -1
        this.dx = direction * this._speed
        // Sprite flip
        this.scaleX = Math.abs(this._initialScale) * direction
        this.animations?.walk && this.playAnimation('walk')
        this.isAdrenalined() && this.animations?.run && this.playAnimation('run')
    }

    activateAdrenaline (adrenalineDuration = 1) {
        this._adrenalineMode = true
        this._speed = this._maxSpeed * 2.1
        this._adrenalineTimeLimit = (adrenalineDuration * 1000) + Date.now()
    }

    deactivateAdrenaline () {
        this._adrenalineMode = false
        this._speed = this._maxSpeed
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