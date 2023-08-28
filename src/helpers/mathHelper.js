/**
* Returns a random number between min (inclusive) and max (exclusive)
*/
export function getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min;
}

/**
* Returns a random integer between min (inclusive) and max (inclusive).
* The value is no lower than min (or the next integer greater than min
* if min isn't an integer) and no greater than max (or the next integer
* lower than max if max isn't an integer).
* Using Math.round() will give you a non-uniform distribution!
*/
export function getRandomInt (min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Converts degrees to radians
 * @param {Number} degrees Degrees
 */
export function degToRad (degrees) {
    return degrees * (Math.PI / 180)
}

/**
 * Converts radians to degrees
 * @param {Number} radians Radians
 */
export function radToDeg (radians) {
    return radians * (180 / Math.PI)
}

export function roundRadiansToNearestStraitAngle (radians) {
    return Math.round(radians / (Math.PI / 2)) * (Math.PI / 2)
}

export default {
    getRandomArbitrary,
    getRandomInt,
    roundRadiansToNearestStraitAngle,
    radToDeg,
    degToRad
}
