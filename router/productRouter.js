const express = require('express')
const { createProduct, updateProduct, getDetailProduct, deleteProduct, getAllProduct, deleteManyProduct } = require('../controllers/productController')
const { authUser, auth } = require('../middleware/auth')
const productRouter = express.Router()

productRouter.get('/product-detail/:id', getDetailProduct)
productRouter.get('/all-product', getAllProduct)
productRouter.post('/create-product', createProduct)
productRouter.put('/update-product/:id', authUser, updateProduct)
productRouter.delete('/delete-product/:id', authUser, deleteProduct)
productRouter.post('/delete-many-product', authUser, deleteManyProduct)

module.exports = productRouter