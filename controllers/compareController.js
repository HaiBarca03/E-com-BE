const CompareModel = require('../models/CompareModel');
const ProductModel = require('../models/ProductModel');

const compareProducts = (products) => {
    const comparisonResults = products.map(product => ({
        name: product.name,
        advantages: [],
        price: product.price,
        rating: product.rating,
        discount: product.discount || 0,
    }));

    // So sánh giá
    const minPrice = Math.min(...comparisonResults.map(p => p.price));
    const maxPrice = Math.max(...comparisonResults.map(p => p.price));

    comparisonResults.forEach(product => {
        if (product.price === minPrice) {
            product.advantages.push('Lowest price');
        } else if (product.price === maxPrice) {
            product.advantages.push('Highest price');
        }
    });

    // So sánh rating
    const maxRating = Math.max(...comparisonResults.map(p => p.rating));

    comparisonResults.forEach(product => {
        if (product.rating === maxRating) {
            product.advantages.push('Highest rating');
        }
    });

    // So sánh discount
    const maxDiscount = Math.max(...comparisonResults.map(p => p.discount));

    comparisonResults.forEach(product => {
        if (product.discount === maxDiscount) {
            product.advantages.push('Best discount');
        }
    });

    return comparisonResults;
};

const getCompare = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { productIds } = req.query;

        const compareEntry = await CompareModel.findOne({ user_id });

        // Kiểm tra sự tồn tại
        if (!compareEntry) {
            return res.status(404).json({ error: 'No comparison entry found for this user.' });
        }

        let products;
        if (productIds) {
            const idsArray = productIds.split(',');
            products = await ProductModel.find({ _id: { $in: idsArray } });
        } else {
            products = await ProductModel.find({ _id: { $in: compareEntry.items.map(item => item.product_id) } });
        }

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found for comparison.' });
        }

        const comparisonResults = compareProducts(products);

        return res.status(200).json({
            comparisonResults,
            compareEntry,
        });
    } catch (error) {
        console.error('Error fetching compare products:', error.message);
        return res.status(500).json({ error: 'Failed to fetch compare products' });
    }
};

const getAllCompare = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Tìm tất cả các mục so sánh của người dùng
        const compares = await CompareModel.find({ user_id })
        // .populate('items.product_id')
        // .exec();

        if (!compares || compares.length === 0) {
            return res.status(404).json({ message: 'No comparisons found for this user.' });
        }

        return res.status(200).json(compares);
    } catch (error) {
        console.error('Error fetching comparisons:', error.message);
        return res.status(500).json({ error: 'Failed to fetch comparisons' });
    }
};

const addCompare = async (req, res) => {
    try {
        const { user_id, productIds } = req.body;

        // // Kiểm tra xem có ít nhất 2 ID sản phẩm không
        // if (!Array.isArray(productIds) || productIds.length < 2) {
        //     return res.status(400).json({ error: 'You must provide at least 1 product IDs for comparison.' });
        // }

        const products = await ProductModel.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(404).json({ error: 'One or more products not found.' });
        }

        const compareEntry = new CompareModel({
            user_id,
            items: productIds.map(id => ({ product_id: id })),
        });

        await compareEntry.save();

        return res.status(201).json({
            message: 'Products added to comparison successfully.',
            compareEntry,
        });
    } catch (error) {
        console.error('Error adding comparison:', error.message);
        return res.status(500).json({ error: 'Failed to add comparison' });
    }
};

const deleteCompareProduct = async (req, res) => {
    try {
        const { user_id, productId } = req.body;

        const compareEntry = await CompareModel.findOne({ user_id });

        if (!compareEntry) {
            return res.status(404).json({ error: 'Comparison entry not found.' });
        }

        const itemIndex = compareEntry.items.findIndex(item => item.product_id.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Product not found in comparison.' });
        }

        compareEntry.items.splice(itemIndex, 1);

        await compareEntry.save();

        return res.status(200).json({ message: 'Product removed from comparison successfully.', compareEntry });
    } catch (error) {
        console.error('Error deleting compare product:', error.message);
        return res.status(500).json({ error: 'Failed to delete compare product' });
    }
};

module.exports = {
    getCompare,
    addCompare,
    getAllCompare,
    deleteCompareProduct
};
