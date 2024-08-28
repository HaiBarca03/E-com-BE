// emailController.js
const nodemailer = require('nodemailer');
const UserModel = require('../models/UserModel')

const sendOrderConfirmationEmail = async (user, orderDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Sử dụng Gmail, bạn có thể đổi thành dịch vụ khác
        auth: {
            user: 'hdoan82300@gmail.com', // Thay bằng email của bạn
            pass: 'rvuo rvjg apwy nolv',  // Thay bằng mật khẩu email của bạn
        },
    });

    const mailOptions = {
        from: 'hdoan82300@gmail.com',  // Email gửi đi
        to: 'hdoan82300@gmail.com',  // Email người nhận
        subject: 'Xác nhận đơn hàng của bạn',
        html: `
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Thông tin đơn hàng của bạn:</p>
        <p><strong>Người nhận:</strong> ${orderDetails.fullName}</p>
        <p><strong>Địa chỉ:</strong> ${orderDetails.address}, ${orderDetails.city}</p>
        <p><strong>Điện thoại:</strong> ${orderDetails.phone}</p>
        <p><strong>Phương thức thanh toán:</strong> ${orderDetails.paymentMethod}</p>
        <p><strong>Tổng số tiền:</strong> ${orderDetails.totalPrice} USD</p>
        <h3>Chi tiết sản phẩm:</h3>
        <ul>
        ${orderDetails.orderItems.map(item => `<li>${item.name} - Số lượng: ${item.amount} - Giá: ${item.price} USD</li>`).join('')}
        </ul>
        <p>Bạn có thể theo dõi đơn hàng của mình tại <a href="${orderDetails.frontend_url}">đây</a>.</p>
        `
    };
    console.log('Recipient email:', user.email);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = { sendOrderConfirmationEmail };
