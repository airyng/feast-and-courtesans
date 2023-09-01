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
            dx: 0,
            dy: 0,
            color: 'red'
        })
    }
  
    draw() {
        super.draw()
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
        this.dx = this._moveDirection * this._speed
        if (this.dx < 0 && this.x - (scene.camera.x - scene.camera.width / 2) <= movementBounds.left) {
            if (scene.camera.x <= scene.camera.width / 2) {
                this.dx = 0
            }
            scene.camera.x += this.dx
            return
        }
        
        if (
            this.dx > 0 &&
            this.x - (scene.camera.x - scene.camera.width / 2) >= scene.camera.width - movementBounds.right - this.width
        ) {
            if (scene.camera.x + scene.camera.width / 2 >= scene.width) {
                this.dx = 0
            }
            scene.camera.x += this.dx
            return
        }
    }
  }