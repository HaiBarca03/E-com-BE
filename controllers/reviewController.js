const OrderModel = require('../models/OrderModel');
const ReviewModel = require('../models/ReviewModel');
const ProductModel = require('../models/ProductModel');

const createComment = async (req, res) => {
    const { user, idProduct, comment, image, rating } = req.body;

    try {
        // Kiểm tra xem người dùng đã mua sản phẩm này chưa
        const userOrders = await OrderModel.find({ user: user, 'orderItems.product': idProduct });
        console.log('idProduct', idProduct)

        if (userOrders.length === 0) {
            return res.status(400).json({ success: false, message: 'Bạn phải mua sản phẩm này trước khi có thể bình luận.' });
        }

        // Tạo review mới
        const newReview = new ReviewModel({
            user: user,
            product: idProduct,
            comment,
            image,
            rating
        });
        // Lưu review vào database
        await newReview.save();

        // Tính toán rating mới cho sản phẩm
        const reviews = await ReviewModel.find({ product: idProduct });
        const averageRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

        // Cập nhật rating cho sản phẩm
        await ProductModel.findByIdAndUpdate(idProduct, { rating: averageRating });

        res.json({ success: true, message: 'Bình luận của bạn đã được đăng.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
};

const getAllComments = async (req, res) => {
    const { idProduct } = req.params;

    try {
        // Lấy tất cả bình luận cho sản phẩm với idProduct
        const reviews = await ReviewModel.find({ product: idProduct }).populate('user', 'name avatar');

        if (reviews.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận nào cho sản phẩm này.' });
        }

        res.json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra.' });
    }
};

module.exports = {
    createComment,
    getAllComments
};
