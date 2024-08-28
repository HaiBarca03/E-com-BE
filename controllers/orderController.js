const OrderModel = require('../models/OrderModel')
const ProductModel = require('../models/ProductModel')
const Stripe = require('stripe');
const { sendOrderConfirmationEmail } = require('./mailController');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createOrder = async (req, res) => {
    const frontend_url = 'http://localhost:3000';
    try {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = req.body;

        // Check input (unchanged)
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.json({ success: false, message: "Thông tin nhập là bắt buộc" }); // Input is required
        }

        const newOrder = new OrderModel({
            orderItems,
            shippingAddress: {
                fullName,
                address,
                city,
                phone,
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user
        });
        console.log('newOrder', newOrder);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: orderItems.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.description,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.amount,
            })),
            mode: 'payment',
            success_url: `${frontend_url}`,
            cancel_url: `${frontend_url}`,
            customer_email: req.body.user?.email,
        });
        newOrder.stripeSessionId = session.id;
        await newOrder.save();

        for (const item of orderItems) {
            const product = await ProductModel.findById(item.product);
            if (product) {
                product.countInStock -= item.amount;
                product.sold += item.amount;
                await product.save(); // Lưu thay đổi vào database
            } else {
                return res.json({ success: false, message: `Sản phẩm với ID ${item.product} không tồn tại` });
            }
        }
        await sendOrderConfirmationEmail(user, {
            fullName,
            address,
            city,
            phone,
            paymentMethod,
            totalPrice,
            orderItems,
            frontend_url
        });

        res.json({ success: true, url: session.url, message: 'Phiên thanh toán được tạo thành công' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Có lỗi xảy ra' });
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // Lấy ID người dùng từ URL
        console.log('userID:', userId)
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        // Truy vấn để tìm tất cả đơn hàng của người dùng với ID cụ thể
        const orders = await OrderModel.find({ user: userId }).populate('user', 'name email').populate('orderItems.product', 'name price');

        if (!orders || orders.length === 0) {
            return res.json({ success: false, message: 'Không tìm thấy đơn hàng nào cho người dùng này' });
        }

        res.json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Có lỗi xảy ra khi lấy đơn hàng' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log('orderId:', orderId)

        // Check if the order exists
        const order = await OrderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Delete the order
        await OrderModel.findByIdAndDelete(orderId);
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const updateOrderPaymentStatus = async (req, res) => {
    const orderId = req.params.id;
    console.log('orderId:', orderId)

    try {
        // Tìm đơn hàng với sessionId từ Stripe
        const order = await OrderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        // Cập nhật trạng thái thanh toán
        order.isPaid = true;
        order.paidAt = Date.now();

        // Lưu thay đổi vào database
        await order.save();

        res.json({ success: true, message: 'Trạng thái thanh toán đã được cập nhật' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán' });
    }
};

const updateOrderDeliveryStatus = async (req, res) => {
    const orderId = req.params.id;
    console.log('orderId:', orderId)

    try {
        // Tìm đơn hàng với sessionId từ Stripe
        const delivery = await OrderModel.findById(orderId)

        if (!delivery) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        // Cập nhật trạng thái thanh toán
        delivery.isDelivered = true;
        delivery.deliveredAt = Date.now();

        // Lưu thay đổi vào database
        await delivery.save();

        res.json({ success: true, message: 'Trạng thái thanh toán đã được cập nhật' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi cập nhật trạng thái thanh toán' });
    }
};

module.exports = {
    createOrder,
    getOrdersByUserId,
    deleteOrder,
    updateOrderPaymentStatus,
    updateOrderDeliveryStatus
}