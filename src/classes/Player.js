import { SpriteClass } from 'kontra'

export default class Player extends SpriteClass {

    _moveDirection = 0
    _maxSpeed = 3
    _speed = 0
    _initialScale = 1
    _adrenalineMode = false
    _adrenalineTimeLimit = false
    _winking = false
    _lastWinkingTime = 0
    _winkingCooldown = 2

    constructor (properties) {
        const scale = properties.scale || 1
        const attrs = {}
        if (properties.image) { attrs.image = properties.image }
        if (properties.animations) { attrs.animations = properties.animations }

        super({
            x: properties.x,
            y: properties.y,
            anchor: {x: 0.5, y: 0},
            scaleX: scale,
            scaleY: scale,
            ...attrs
        })
        this._initialScale = scale
        this._speed = this._maxSpeed

        if (properties.extraAnimations?.winking) {
            const winking = new SpriteClass({
                x: -2,
                y: 5,
                animations: properties.extraAnimations.winking
            })
            winking.opacity = 0
            this.addChild(winking)
        }
    }

    update (movementBounds, scene) {
        if (this._adrenalineMode && this._adrenalineTimeLimit <= Date.now()) { this.deactivateAdrenaline() }
        // Calculates movement and camera positions
        this.calculateMovement(movementBounds, scene)
        super.update()
    }

    setMoveDirection (value) {
        if (this._moveDirection === value) { return }

        if (value === 0) {
            this.animations?.idle && this.playAnimation('idle')
        } else {
            this.animations?.walk && this.playAnimation('walk')
            this.isAdrenalined() && this.animations?.run && this.playAnimation('run')
        }
        this._moveDirection = value
    }

    setWinking (value) {
        if (!value) {
            this._winking = value
        }

        if (!value  ||
            !this.children[0]?.animations?.wink ||
            Date.now() <= this._lastWinkingTime + (this._winkingCooldown * 1000)
         ) { return }
         
        this._winking = value
        // Play winking animation
        this.children[0].opacity = 1
        this.children[0].playAnimation('wink')
        const animationLength = this.children[0].animations.wink.frames.length / this.children[0].animations.wink.frameRate
        setTimeout(() => { this.children[0].opacity = 0 }, animationLength * 1000)

        this._lastWinkingTime = Date.now()
    }

    isWinking () {
        return !!this._winking
    }

    activateAdrenaline (adrenalineDuration = 1) {
        this._adrenalineMode = true
        this._speed = this._maxSpeed * 2
        this._adrenalineTimeLimit = (adrenalineDuration * 1000) + Date.now()
        if (this.dx !== 0) {
            this.animations?.run && this.playAnimation('run')
        }
    }

    deactivateAdrenaline () {
        this._adrenalineMode = false
        this._speed = this._maxSpeed
        this._adrenalineTimeLimit = 0
        if (this.dx !== 0) {
            this.animations?.walk && this.playAnimation('walk')
        }
    }

    isAdrenalined () {
        return !!this._adrenalineMode
    }

    calculateMovement (scene, movementBounds = { left: 150, right: 150 }) {
        // Sprite flip
        if (this._moveDirection !== 0) {
            this.scaleX = this._moveDirection < 0 ? -this._initialScale : this._initialScale
        }
        this.dx = this._moveDirection * this._speed
        const x = (this.x - (this.width * this.anchor.x))
        // Move left
        if (
            this.dx < 0 &&
            x - (scene.camera.x - scene.camera.width / 2) <= movementBounds.left
        ) {
            if (scene.camera.x <= scene.camera.width / 2) { this.dx = 0 }
            scene.camera.x += this.dx
            return
        }
        // Move right
        if (
            this.dx > 0 &&
            x - (scene.camera.x - scene.camera.width / 2) >= scene.camera.width - movementBounds.right - this.width
        ) {
            if (scene.camera.x + scene.camera.width / 2 >= scene.width) { this.dx = 0 }
            scene.camera.x += this.dx
            return
        }
    }
  }