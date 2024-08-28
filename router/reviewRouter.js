const express = require('express')
const { createComment, getAllComments } = require('../controllers/reviewController')
const { auth, authUser } = require('../middleware/auth')
const reviewRouter = express.Router()

reviewRouter.post('/create-comment', createComment);
reviewRouter.get('/get-all-comment/:idProduct', getAllComments);

module.exports = reviewRouter