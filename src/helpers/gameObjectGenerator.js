import { Text, Sprite } from 'kontra'

export const textObjectGenerator = (props = {}) => new Text({
    text: '-',
    font: '26px cursive, Arial',
    color: 'white',
    x: 50, y: 50,
    anchor: {x: 0, y: 0.5},
    textAlign: 'center',
    ...props
})

export const rectangleGenerator = (props = {}) => new Sprite({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    color: 'black',
    anchor: {x: 0, y: 0},
    ...props
})