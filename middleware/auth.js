const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = async (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The not authemtication',
                status: 'ERR'
            })
        }
        const { payload } = user
        if (user.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The not authemtication',
                status: 'ERR'
            })
        }
    });
}

const authUser = async (req, res, next) => {
    const userId = req.params.id
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The not authemtication',
                status: 'ERR'
            })
        }
        const { payload } = user
        if (user.isAdmin || user.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The not authemtication',
                status: 'ERR'
            })
        }
    });
}

module.exports = { auth, authUser }