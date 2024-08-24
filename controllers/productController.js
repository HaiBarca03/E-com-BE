const ProductModel = require('../models/ProductModel')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, selled } = req.body
        // check input
        if (!name || !image || !type || !price || !countInStock || !rating || !description || !selled) {
            return res.json({ success: false, message: "Input is required" })
        }
        const checkProduct = await ProductModel.findOne({
            name: name
        })
        if (checkProduct) {
            return res.json({ success: false, message: "Product already exists" })
        }
        //hashing user password
        const newProduct = new ProductModel({
            name: name,
            image: image,
            type: type,
            price: price,
            countInStock: countInStock,
            rating: rating,
            description: description,
            selled: selled,
        })

        const product = await newProduct.save()

        res.json({
            success: true,
            data: newProduct,
            message: 'create product success'
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Error' })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const { name, image, type, price, countInStock, rating, description } = req.body;

    try {
        // Check if the user exists
        const checkProduct = await ProductModel.findById(productId)
        if (!checkProduct) {
            return res.json({ success: false, message: "Product is not exists" })
        }

        // Update the user
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true });

        if (!updatedProduct) {
            return res.json({ success: false, message: 'Failed to update product' });
        }

        // Return success response
        res.json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating product' });
    }
}

const getAllProduct = async (req, res) => {
    const { limit, page = 0, sort, filter } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);

    try {
        const totalProduct = await ProductModel.countDocuments(filter ? { [filter[0]]: { '$regex': filter[1] } } : {});

        const pageCurrent = Number(pageNum + 1);
        const totalPage = Math.ceil(totalProduct / limitNum);

        const objectSort = {};
        if (sort) {
            objectSort[sort[1]] = sort[0];
        }

        const allProduct = await ProductModel.find(filter ? { [filter[0]]: { '$regex': filter[1] } } : {})
            .sort(objectSort)
            .skip(page * limitNum)
            .limit(limitNum);

        res.json({
            success: true,
            data: allProduct,
            total: totalProduct,
            pageCurrent,
            totalPage,
            message: 'product all'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error get product' });
    }
};

// const getAllProduct = async (req, res) => {
//     const { limit = 2, page = 0, sort, filter } = req.query;
//     const limitNum = parseInt(limit);
//     const pageNum = parseInt(page);

//     try {
//         const totalProduct = await ProductModel.countDocuments();
//         const pageCurrent = Number(pageNum + 1);
//         const totalPage = Math.ceil(totalProduct / limitNum);

//         let allProduct;
//         const objectSort = {};
//         if (sort) {
//             objectSort[sort[1]] = sort[0];
//             allProduct = await ProductModel.find().limit(limit).skip(page * limit).sort(objectSort);
//         } else if (filter) {
//             const lable = filter[0];
//             allProduct = await ProductModel.find({ [lable]: { '$regex': filter[1] } }).limit(limit).skip(page * limit).sort(objectSort);
//         } else {
//             allProduct = await ProductModel.find().limit(limitNum).skip(page * limitNum);
//         }

//         res.json({
//             success: true,
//             data: allProduct,
//             total: totalProduct,
//             pageCurrent,
//             totalPage,
//             message: 'product all'
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false, message: 'Error get product' });
//     }
// };

const getDetailProduct = async (req, res) => {
    const productId = req.params.id;
    // const token = req.headers

    try {
        // Check if the user exists
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: 'Product does not exist' });
        }

        // Return success response
        res.json({
            success: true,
            data: product,
            message: 'detail product'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error get detail product' });
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const token = req.headers

    try {
        // Check if the product exists
        const checkProduct = await ProductModel.findById(productId);
        if (!checkProduct) {
            return res.json({ success: false, message: 'product does not exist' });
        }

        // Update the product
        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.json({ success: false, message: 'Failed to update user' });
        }

        // Return success response
        console.log('token:', token)
        res.json({
            success: true,
            message: 'product deleted'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user' });
    }
}

const deleteManyProduct = async (req, res) => {
    const ids = req.body.ids
    const token = req.headers

    try {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        if (!ids) {
            return res.json({ success: false, message: 'ids does not exist' });
        }

        // Update the product
        const deletedProductMany = await ProductModel.deleteMany({ _id: { $in: idsArray } });

        if (!deletedProductMany) {
            return res.json({ success: false, message: 'Failed to update user' });
        }

        // Return success response
        console.log('token:', token)
        res.json({
            success: true,
            message: 'product many deleted'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error updating user' });
    }
}

module.exports = {
    getAllProduct,
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    deleteManyProduct
}