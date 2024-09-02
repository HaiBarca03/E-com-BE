const ProductModel = require('../models/ProductModel')
const SaleModel = require('../models/SalesModel')
const { format } = require('date-fns');

const createSale = async (req, res) => {
    try {
        const { productId, saleQuantity, startDate, endDate } = req.body;
        // Tìm sản phẩm dựa trên productId
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Tính toán giá mới dựa trên giá cũ và discount
        const oldPrice = product.price;
        const discount = product.discount || 0;
        const newPrice = oldPrice * (1 - discount / 100);

        const newSale = new SaleModel({
            product: productId, // ObjectId của sản phẩm
            oldPrice: oldPrice,
            newPrice: newPrice,
            discount: discount,
            saleQuantity: saleQuantity,
            startDate: startDate,
            endDate: endDate
        });

        const savedSale = await newSale.save();
        // console.log('Sale created successfully:', savedSale);
        return res.status(201).json(savedSale);
    } catch (error) {
        console.error('Error creating sale:', error.message);
        return res.status(500).json({ error: 'Failed to create sale' });
    }
};

const updateSale = async (req, res) => {
    try {
        const { saleId, saleQuantity, startDate, endDate } = req.body;

        const sale = await SaleModel.findById(saleId);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        const product = await ProductModel.findById(sale.product);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (saleQuantity !== undefined) {
            sale.saleQuantity = saleQuantity;
        }
        if (startDate) {
            sale.startDate = new Date(startDate);
        }
        if (endDate) {
            sale.endDate = new Date(endDate);
        }

        const updatedSale = await sale.save();
        console.log('Sale updated successfully:', updatedSale);
        return res.status(200).json(updatedSale);
    } catch (error) {
        console.error('Error updating sale:', error.message);
        return res.status(500).json({ error: 'Failed to update sale' });
    }
};

const deleteSale = async (req, res) => {
    try {
        const { saleId } = req.body;

        // Tìm sale dựa trên saleId
        const sale = await SaleModel.findById(saleId);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        // Xóa sale
        await SaleModel.findByIdAndDelete(saleId);
        console.log('Sale deleted successfully:', saleId);
        return res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error.message);
        return res.status(500).json({ error: 'Failed to delete sale' });
    }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await SaleModel.find().populate('product');
        return res.status(200).json(sales);
    } catch (error) {
        console.error('Error fetching sales:', error.message);
        return res.status(500).json({ error: 'Failed to fetch sales' });
    }
};

module.exports = {
    createSale,
    updateSale,
    deleteSale,
    getAllSales
}

