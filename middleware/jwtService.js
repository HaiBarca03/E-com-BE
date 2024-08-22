const jwt = require('jsonwebtoken')
require('dotenv').config()

const genneralAccessToken = async (payload) => {
    // console.log('payload', payload)
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '20s' })

    return access_token
}

const genneralRefreshToken = async (payload) => {
    // console.log('payload', payload)
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '60d' })

    return refresh_token
}

const refreshTokenJwt = (token) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('token', token)

            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'The not authemtication',
                    })
                }
                const access_token = await genneralAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                console.log('access_token: ', access_token)
                resolve({
                    status: 'OK',
                    message: 'SUCESS',
                    access_token: access_token
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwt
}