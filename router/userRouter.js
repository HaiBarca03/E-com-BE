const express = require('express')
const {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logOutUser,
    deleteManyUser
} = require('../controllers/userController')
const { auth, authUser } = require('../middleware/auth')
const userRouter = express.Router()

userRouter.get('/all-user', getAllUser)
userRouter.get('/detail-user/:id', authUser, getDetailUser)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logOutUser)
userRouter.put('/update-user/:id', updateUser)
userRouter.delete('/delete-user/:id', auth, deleteUser)
userRouter.post('/delete-many-user', auth, deleteManyUser)
userRouter.post('/refresh-token', refreshToken)

module.exports = userRouter