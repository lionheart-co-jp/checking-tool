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
        res.headlines = []
        const dom = new JSDOM(res.encodedBody)
        const headlines = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        for(let v of headlines) {
            const level = v.nodeName.replace('H', '') - 0
            const label = v.innerHTML

            res.headlines.push({
                level,
                label,
            })
        }

        return res
    }
}

module.exports = new Alt