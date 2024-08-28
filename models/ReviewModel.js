const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Rating từ 1 đến 5
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    commentDate: {
        type: Date,
        default: Date.now, // Ngày comment mặc định là ngày hiện tại
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const ReviewModel = mongoose.model('Reviews', reviewSchema);

module.exports = ReviewModel;
