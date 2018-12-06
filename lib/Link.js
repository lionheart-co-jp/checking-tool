const request = require('./Request')
const {JSDOM} = require('jsdom')
const {URL} = require('url')

class Alt {
    async request({url, user, pass}) {
        const res = await request(url, {user: user, pass: pass})

        if (res.statusCode >= 300) {
            return res
        }

        // Get Anchor links
        res.anchors = []
        const dom = new JSDOM(res.encodedBody)
        const anchors = dom.window.document.querySelectorAll('a')
        for(let v of anchors) {
            const href = v.getAttribute('href')
            const target = v.getAttribute('target')
            const label = v.innerHTML

            let actualUrl
            if (href.match(/^http(s)?\:/)) {
                actualUrl = new URL(href)
            } else {
                actualUrl = new URL(href, url)
            }

            res.anchors.push({
                url: actualUrl.toString(),
                user,
                pass,
                href,
                target,
                label,
            })
        }

        return res
    }

    async exists({url, user, pass}) {
        return await request(url, {user: user, pass: pass})
    }
}

module.exports = new Alt