import { init, getContext } from 'kontra'
import { mainSS } from './spriteSheetsMap'
import spriteSheets from './spriteSheetsMap'
import { setObjectDimensions } from './helpers/graphicsHelper'

const   width = 1200,
        height = 800,
        { canvas } = init()
        
canvas.width = width
canvas.height = height
getContext().imageSmoothingEnabled = false

;['load', 'resize'].forEach(type => window.addEventListener(type, () => setObjectDimensions(canvas, document.querySelector('body'))))

// Load all the sprites and spritesheets
// await load(...Object.keys(sprites).map((key) => sprites[key]))
// const spriteSheets = (await import ('./spriteSheetsMap')).default

const gameProps = {
    width,
    height,
    mainSS,
    spriteSheets,
    sceneSetupsList: {
        start: (await import ('./scenes/start')).default,
        game: (await import ('./scenes/game')).default,
    }
}

const loadScene = async (currentScene, nextSceneSetup) => {
    currentScene?.beforeDestroy?.()
    currentScene?.destroy?.()
    const { loop } = await nextSceneSetup(gameProps, loadScene)
    loop.start()
}

// loadScene(null, gameProps.sceneSetupsList.game)
loadScene(null, gameProps.sceneSetupsList.start)
