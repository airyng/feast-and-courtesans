import { SpriteClass } from 'kontra'

export default class Player extends SpriteClass {

    _moveDirection = 0
    _speed = 8
    _winking = false

    constructor(properties) {
        super({
            x: properties.x,
            y: properties.y,
            // required for a rectangle sprite
            width: 70,
            height: 120,
            anchor: {x: 0.5, y: 0},
            color: 'red'
        })

        this.addChild(new SpriteClass({
            x: 25,
            y: 15,
            // required for a rectangle sprite
            width: 5,
            height: 5,
            color: 'black'
        }))
    }

    update (movementBounds, scene) {
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

    calculateMovement (movementBounds, scene) {
        // Sprite flip
        if (this._moveDirection !== 0) {
            this.scaleX = this._moveDirection < 0 ? -1 : 1
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