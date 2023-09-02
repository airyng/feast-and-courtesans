import { SpriteClass } from 'kontra'

export default class Player extends SpriteClass {

    _moveDirection = 0
    _speed = 3
    _winking = false
    _initialScale = 1
    _adrenalineMode = false
    _adrenalineTimeLimit = false

    constructor(properties) {
        const scale = properties.scale || 1
        super({
            x: properties.x,
            y: properties.y,
            anchor: {x: 0.5, y: 0},
            scaleX: scale,
            scaleY: scale,
            image: properties.image
        })
        this._initialScale = scale
    }

    update (movementBounds, scene) {
        if (this._adrenalineMode && this._adrenalineTimeLimit <= Date.now()) { this.deactivateAdrenaline() }
        // Calculates movement and camera positions
        this.calculateMovement(movementBounds, scene)
        super.update()
    }

    setMoveDirection (value) {
        this._moveDirection = value
    }

    setWinking (value) {
        this._winking = value
    }

    isWinking () {
        return !!this._winking
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

    calculateMovement (movementBounds, scene) {
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