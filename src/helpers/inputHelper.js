export default {
    handlers: {},
    pressedButtons: [],
    init () {
        // handle user input
        document.onkeydown = (event) => {
            if (event.repeat) { return };
            this.pressedButtons.push(event.code)
            this.handlers[event.code]?.down?.()
        }
        
        document.onkeyup = (event) => {
            this.pressedButtons = this.pressedButtons.filter(code => code !== event.code)
            this.handlers[event.code]?.up?.()
        }
    },
    on (key, callbackDown, callbackUp) {
        this.handlers[key] = { down: callbackDown, up: callbackUp }
    },
    off (key) {
        delete this.handlers[key]
    },
    isPressed (key) {
        return this.pressedButtons.findIndex(_key => _key === key) > -1
    },
    getMaxPriorityPressedButton (keys = []) {
        const maxPriorityIndex = keys
                                    .map(key => this.pressedButtons.findIndex(_key => _key === key))
                                    .reduce((prev, value) => Math.max(prev, value), -1)
        return this.pressedButtons[maxPriorityIndex]
    }
}