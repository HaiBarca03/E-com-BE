const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const dbConnect = require('./config/db')
const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
const orderRouter = require('./router/orderRouter')

const app = express()

// config
const port = process.env.PORT || 4000
// app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())
require('dotenv').config()

// db connect
dbConnect()

// api
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`App running on port: ${port}`)
})