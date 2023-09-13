import { randInt } from 'kontra'

export const cropImage = (sourceImage, x, y, w, h) => {
    return new Promise(resolve => {
        const   canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                newImage = document.createElement('img')
        canvas.width = w
        canvas.height = h
        ctx.drawImage(sourceImage,
            x, y,   // Start at 70/20 pixels from the left and the top of the image (crop),
            w, h,   // "Get" a `50 * 50` (w * h) area from the source image (crop),
            0, 0,   // Place the result at 0, 0 in the canvas,
            w, h)   // With as width / height: 100 * 100 (scale)
        newImage.src = canvas.toDataURL('image/png')
        resolve(newImage)
    })
}

export const drawLine = (scene, from = {x: 0, y: 0}, to = {x: 0, y: 0}, lineWidth = 1, color = 'grey') => {
    const ctx = scene.context
    ctx.beginPath() // Start a new path
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.moveTo(from.x, from.y) // Move the pen to
    ctx.lineTo(to.x, to.y) // Draw a line to
    ctx.stroke() // Render the path
}

export const setObjectDimensions = (targetElement, containerElement) => {

    const   width = targetElement.width,
            height = targetElement.height,
            maxWidth = containerElement.clientWidth,
            maxHeight = containerElement.clientHeight
    
    let ratio = maxWidth / width

    if (maxWidth > maxHeight && height * ratio > maxHeight) {
        ratio = maxHeight / height
    }
    if (maxHeight > maxWidth && width * ratio > maxWidth) {
        ratio = maxWidth / width
    }
    targetElement.style.width = `${width * ratio}px`
    targetElement.style.height = `${height * ratio}px`
}

export const createBlinkingStars = (starsNumber, scene, from = { x: 0, y: 0 }, to = { x: 0, y: 0 }) => {
    const stars = new Array(starsNumber).fill(null).map(() => ({ x: randInt(from.x, to.x), y: randInt(from.y, to.y), visible: true }))
    const starsBlinkingInterval = setInterval(() => {
        const hiddenStar = stars.find(star => !star.visible)
        if (hiddenStar) { hiddenStar.visible = true }
        stars[randInt(0, stars.length - 1)].visible = false
    }, 500)

    return {
        stars,
        render () {
            stars.forEach((star) => {
                if (!star.visible) { return }
                drawLine(scene, {x: star.x, y: star.y}, {x: star.x + 1, y: star.y + 1})
            })
        },
        destroy () {
            clearInterval(starsBlinkingInterval)
        }
    }
}