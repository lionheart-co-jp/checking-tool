const request = require('./Request')
const {JSDOM} = require('jsdom')
const {URL} = require('url')

class Alt {
    async request({url, user, pass}) {
        const res = await request(url, {user: user, pass: pass})

        if (res.statusCode >= 300) {
            return res
        }

        // Get Image Alt
        res.images = []
        const dom = new JSDOM(res.encodedBody)
        const images = dom.window.document.querySelectorAll('img')
        for(let v of images) {
            const src = v.getAttribute('src')
            const alt = v.getAttribute('alt')
            const imgUrl = new URL(src, url)

            if (user && pass) {
                imgUrl.username = user
                imgUrl.password = pass
            }

            res.images.push({
                url: imgUrl.toString(),
                src,
                alt,
                flag: v.hasAttribute('alt'),
            })
        }

        return res
    }
}

module.exports = new Alt