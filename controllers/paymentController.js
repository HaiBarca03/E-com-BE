const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const createPaymentSession = async (orderItems, user, frontend_url) => {
    // const frontend_url = 'http://localhost:3000';
    try {
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
            customer_email: user?.email,
        });

        return { success: true, sessionId: session.id, url: session.url };
    } catch (error) {
        console.error("Error creating payment session:", error);
        return { success: false, message: 'Có lỗi xảy ra khi tạo phiên thanh toán' };
    }
};

module.exports = {
    createPaymentSession,
};
