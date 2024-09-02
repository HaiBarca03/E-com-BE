const mongoose = require('mongoose');
const ProductModel = require('./ProductModel'); // Đường dẫn tới model Product của bạn

const saleSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Tham chiếu đến ProductModel
        required: true
    },
    oldPrice: {
        type: Number,
        required: true
    },
    newPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    saleQuantity: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const SaleModel = mongoose.model('Sale', saleSchema);

module.exports = SaleModel;
