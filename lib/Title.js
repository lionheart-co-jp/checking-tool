const request = require('./Request')
const {JSDOM} = require('jsdom')
const {URL} = require('url')

class Title {
    async request({url, user, pass}) {
        const res = await request(url, {user: user, pass: pass})

        if (res.statusCode >= 300) {
            return res
        }

        const dom = new JSDOM(res.encodedBody)
        res.response = {}

        res.response['title'] = dom.window.document.querySelector('title').textContent

        const meta = dom.window.document.querySelectorAll('meta')
        meta.forEach((v, i) => {
            let name = ''

            if (v.hasAttribute('name')) {
                name = v.getAttribute('name')
            } else if (v.hasAttribute('property')) {
                name = v.getAttribute('property')
            }

            if (name !== '') {
                res.response[name] = v.getAttribute('content')

                if (name === 'og:image') {
                    const imgUrl = new URL(res.response[name])

                    if (user && pass) {
                        imgUrl.username = user
                        imgUrl.password = pass
                    }

                    res.response['og:image_preview'] = imgUrl.toString()
                }
            }
        })

        return res
    }
}

module.exports = new Title
