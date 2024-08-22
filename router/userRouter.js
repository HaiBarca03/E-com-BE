const express = require('express')
const { registerUser, loginUser, updateUser, deleteUser, getAllUser, getDetailUser, refreshToken, logOutUser } = require('../controllers/userController')
const { auth, authUser } = require('../middleware/auth')
const userRouter = express.Router()

userRouter.get('/all-user', auth, getAllUser)
userRouter.get('/detail-user/:id', authUser, getDetailUser)
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logOutUser)
userRouter.put('/update-user/:id', updateUser)
userRouter.delete('/delete-user/:id', auth, deleteUser)
userRouter.post('/refresh-token', refreshToken)

module.exports = userRouter