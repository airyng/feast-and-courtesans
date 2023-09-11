import { Text, Sprite, Pool } from 'kontra'

export const textObjectGenerator = (props = {}) => new Text({
    text: '-',
    font: '24px cursive, Arial',
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

export const poolGenerator = (settings = {}) => {
    let pool = Pool({ maxSize: settings.maxSize || 1, create: Sprite })
    return {
        pool,
        update: () => {
            pool.get(settings.get())
            pool.update()
        },
        destroy: () => {
            pool.objects.forEach(o => {
                o.opacity = 0
                o.ttl = 0
            })
            pool.clear()
        }
    }
}
