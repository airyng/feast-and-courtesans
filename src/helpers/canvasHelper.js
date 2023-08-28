

export function cropImage(imageElement, x, y, width, height) {

    // Create a new <canvas> element
    var canvas = document.createElement("canvas")
    // Get the 2D context for drawing on the canvas
    var ctx = canvas.getContext("2d")

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    canvas.width = width
    canvas.height = height
  
    // Draw the image on the canvas, cropping it based on the provided coordinates and dimensions
    ctx.drawImage(imageElement, x, y, width, height, 0, 0, width, height)
  
    // Create a new <img> element and set its source data from the canvas
    // image.src = canvas.toDataURL(); // Convert the canvas to an image
  
    // Return the new <img> element with the cropped image
    return canvas.toDataURL()
}

export function scaleImage(imageElement, scaleX, scaleY) {
    // Создаем новый элемент <canvas>
    var canvas = document.createElement("canvas");
    var width = imageElement.width * scaleX;
    var height = imageElement.height * scaleY;
    canvas.width = width;
    canvas.height = height;
  
    // Получаем 2D контекст для рисования на холсте
    var ctx = canvas.getContext("2d");
  
    // Рисуем изображение на холсте с учетом масштабирования
    ctx.drawImage(imageElement, 0, 0, width, height, 0, 0, width, height);
  
    // Создаем новый элемент <img> и устанавливаем его исходным источником данных из холста
    var scaledImageElement = document.createElement("img");
    scaledImageElement.src = canvas.toDataURL(); // Преобразовываем холст в изображение
  
    // Возвращаем новый элемент <img> с масштабированным изображением
    return scaledImageElement;
}