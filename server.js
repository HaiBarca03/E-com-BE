const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const helmet = require("helmet");
const dbConnect = require('./config/db')

// router
const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
const orderRouter = require('./router/orderRouter')
const reviewRouter = require('./router/reviewRouter');
const saleRouter = require('./router/saleRouter');
const compareRouter = require('./router/compareRouter');

const app = express()

// config
const port = process.env.PORT || 4000
// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('combined'));
app.use(helmet());
require('dotenv').config()

// db connect
dbConnect()

// api
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)
app.use('/api/sale', saleRouter)
app.use('/api/compare', compareRouter)

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`App running on port: ${port}`)
})