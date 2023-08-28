
import { load } from 'kontra'

export default class ResourceLoader {

    static loadedAssets = {}

    static load (path, name) {
        if (!name) { name = Date.now() }
        return new Promise ((resolve) => {

            load(path)
                .then((assets) => {
                    this.loadedAssets[name] = assets[0]
                    resolve(assets[0])
                })
                .catch(function(err) {
                    console.error(err)
                    resolve(false)
                })
        })
    }

    static getImage (name) {
        return this.loadedAssets[name] || null
    }
}