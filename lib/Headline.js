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
        let prev = 0
        let h1Available = false

        for(let v of headlines) {
            const level = v.nodeName.replace('H', '') - 0
            const label = v.innerHTML

            // Check Headline Error
            let flag = (level-prev <= 1)
            let message = flag ? '' : 'Headline skipped'
            if (flag && level === 1 && h1Available) {
                flag = false
                message = 'Duplicated <h1>'
            }

            if (level === 1) {
                h1Available = true
            }
            prev = level

            res.headlines.push({
                level,
                label,
                flag,
                message,
            })
        }

        return res
    }
}

module.exports = new Alt