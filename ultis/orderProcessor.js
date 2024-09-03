const amqp = require('amqplib');
const OrderModel = require('../models/OrderModel');
const ProductModel = require('../models/ProductModel');
const { createPaymentSession } = require('../controllers/paymentController');
const { sendOrderConfirmationEmail } = require('../controllers/mailController');

const processOrders = async () => {
    try {
        const connection = await amqp.connect('amqp://127.0.0.1'); // Change this if your RabbitMQ server is hosted elsewhere
        const channel = await connection.createChannel();
        const queue = 'orderQueue';

        await channel.assertQueue(queue, { durable: true });

        console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const orderData = JSON.parse(msg.content.toString());

                try {
                    let isOrderValid = true;
                    for (const item of orderData.orderItems) {
                        const product = await ProductModel.findById(item.product);
                        if (!product || product.countInStock < item.amount) {
                            isOrderValid = false;
                            break;
                        }
                    }

                    if (!isOrderValid) {
                        console.log('Order invalid, not enough stock');
                        channel.nack(msg); // Reject and requeue the message
                        return;
                    }

                    const newOrder = new OrderModel({
                        orderItems: orderData.orderItems,
                        shippingAddress: {
                            fullName: orderData.fullName,
                            address: orderData.address,
                            city: orderData.city,
                            phone: orderData.phone,
                        },
                        paymentMethod: orderData.paymentMethod,
                        itemsPrice: orderData.itemsPrice,
                        shippingPrice: orderData.shippingPrice,
                        totalPrice: orderData.totalPrice,
                        user: orderData.user
                    });

                    const paymentResult = await createPaymentSession(orderData.orderItems, orderData.user, 'http://localhost:3000');

                    if (!paymentResult.success) {
                        console.log('Payment session creation failed');
                        channel.nack(msg); // Reject and requeue the message
                        return;
                    }

                    newOrder.stripeSessionId = paymentResult.sessionId;
                    await newOrder.save();

                    for (const item of orderData.orderItems) {
                        const product = await ProductModel.findById(item.product);
                        if (product) {
                            product.countInStock -= item.amount;
                            product.sold += item.amount;
                            await product.save();
                        }
                    }

                    await sendOrderConfirmationEmail(orderData.user, {
                        fullName: orderData.fullName,
                        address: orderData.address,
                        city: orderData.city,
                        phone: orderData.phone,
                        paymentMethod: orderData.paymentMethod,
                        totalPrice: orderData.totalPrice,
                        orderItems: orderData.orderItems,
                        frontend_url: 'http://localhost:3000'
                    });

                    console.log('Order processed successfully');
                    channel.ack(msg); // Acknowledge that the message has been successfully processed
                } catch (error) {
                    console.error('Error processing order:', error);
                    channel.nack(msg); // Reject and requeue the message
                }
            }
        }, {
            noAck: false // Ensure that messages are acknowledged manually
        });
    } catch (error) {
        console.error('Error setting up RabbitMQ consumer:', error);
    }
};

// Start the consumer
processOrders();
