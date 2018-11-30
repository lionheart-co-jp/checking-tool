const request = require('then-request')

module.exports = async (url, option) => {
    const options = {}

    if (
        typeof option === 'object' &&
        option.hasOwnProperty('user') &&
        option.hasOwnProperty('pass') &&
        option.user !== '' &&
        option.pass !== ''
    ) {
        options.headers = {
            authorization: 'Basic ' + new Buffer(option.user + ':' + option.pass, 'ascii').toString('base64')
        }
    }

    const res = await request('GET', url, options)

    if (res.statusCode >= 300) {
        var err = new Error(`Server responded with status code ${res.statusCode}:\n ${res.body.toString()}`);
        err.statusCode = res.statusCode;
        err.headers = res.headers;
        err.body = res.body;
        return err
    }

    // Encode
    res.encodedBody = res.body.toString()

    return res
}