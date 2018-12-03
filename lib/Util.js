const request = require('./Request')

class Util {
    constructor() {
        this.app = null
    }

    async urlToBase64(url) {
        const res = await request(url)

        if (res.statusCode >= 300) {
            return res
        }

        const base64 = res.body.toString('base64')
        const encode = res.headers['content-type']

        return `data:${encode};base64,${base64}`
    }

    screenShot(app) {
        return async function() {
            return app.mainWindow().page_.screenshot({
                type: 'jpeg',
                quality: 90,
                fullPage: true,
                encoding: 'base64',
            })
        }
    }
}

module.exports = new Util
