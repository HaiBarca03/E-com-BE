const express = require('express')
const {
    createSale,
    updateSale,
    deleteSale,
    getAllSales
} = require('../controllers/saleController')
const { auth, authUser } = require('../middleware/auth')
const saleRouter = express.Router()

saleRouter.get('/get-all-sales', auth, getAllSales)
saleRouter.post('/create-sale', auth, createSale)
saleRouter.put('/update-sale', auth, updateSale)
saleRouter.delete('/delete-sale', auth, deleteSale);

module.exports = saleRouter