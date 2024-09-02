const express = require('express')
const { getCompare, addCompare, deleteCompareProduct, getAllCompare } = require('../controllers/compareController')
const { auth, authUser } = require('../middleware/auth')
const compareRouter = express.Router()

compareRouter.post('/add-compare', addCompare)
compareRouter.get('/get-compare/:user_id?productIds=productId1,productId2', getCompare)
compareRouter.get('/get-all-compare/:user_id', getAllCompare)
compareRouter.delete('/delete-compare', deleteCompareProduct)

module.exports = compareRouter