const express = require('express')
const { createComment, getAllComments, getAllReview } = require('../controllers/reviewController')
const { auth, authUser } = require('../middleware/auth')
const reviewRouter = express.Router()

reviewRouter.post('/create-comment', createComment);
reviewRouter.get('/get-all-comment/:idProduct', getAllComments);
reviewRouter.get('/get-all-review', getAllReview);

module.exports = reviewRouter