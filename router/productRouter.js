const express = require('express')
const { createProduct, updateProduct, getDetailProduct, deleteProduct, getAllProduct } = require('../controllers/productController')
const { authUser } = require('../middleware/auth')
const productRouter = express.Router()

productRouter.get('/product-detail/:id', getDetailProduct)
productRouter.get('/all-product', getAllProduct)
productRouter.post('/create-product', createProduct)
productRouter.put('/update-product/:id', authUser, updateProduct)
productRouter.delete('/delete-product/:id', deleteProduct)

module.exports = productRouter