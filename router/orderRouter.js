const express = require('express')
const { createOrder, getOrdersByUserId, deleteOrder, updateOrderPaymentStatus, updateOrderDeliveryStatus } = require('../controllers/orderController')
const { auth, authUser } = require('../middleware/auth')
const orderRouter = express.Router()

orderRouter.post('/create-order', createOrder)
orderRouter.get('/get-order-user/:id', getOrdersByUserId)
orderRouter.delete('/delete-order/:id', deleteOrder)
orderRouter.put('/update-order/:id', updateOrderPaymentStatus)
orderRouter.put('/update-delirery-order/:id', updateOrderDeliveryStatus)

module.exports = orderRouter