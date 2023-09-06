export const drawLine = (scene, from = {x: 0, y: 0}, to = {x: 0, y: 0}, color = 'grey', lineWidth = 1) => {
    const ctx = scene.context
    ctx.beginPath() // Start a new path
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.moveTo(from.x, from.y) // Move the pen to
    ctx.lineTo(to.x, to.y) // Draw a line to
    ctx.stroke() // Render the path
}