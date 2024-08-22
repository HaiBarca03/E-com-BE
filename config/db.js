require('dotenv').config()
const mongoose = require('mongoose');

const DATABASE = process.env.DB_CONNECT

const dbConnect = () => {
    try {
        mongoose.connect(DATABASE);
        // await mongoose.connect(DB_CONNECT_LOCAL)
        console.log('db connected successfully');
    } catch (error) {
        console.error('db connection failed:', error);
    }
}

module.exports = dbConnect;