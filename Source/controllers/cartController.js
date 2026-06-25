const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calculateCartTotals = (cart) => {
    cart.totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,0
    );

    cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.totalPrice, 0
    );

    cart.totalSaving = cart.items.reduce(
        (sum, item) =>
            sum + ((item.price - item.discountPrice) * item.quantity), 0
    );
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid productId and quantity required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user.id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        const finalPrice = product.discountPrice || product.price;

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].totalPrice =
                cart.items[itemIndex].quantity *
                cart.items[itemIndex].discountPrice;
        } else {
            cart.items.push({
                productId: product._id,
                productName: product.name,
                productImage: product.images?.[0]?.url || "",
                quantity,
                unit: product.unit || "",
                price: product.price,
                discountPrice: finalPrice,
                totalPrice: finalPrice * quantity
            });
        }

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: null
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        item.quantity = quantity;
        item.totalPrice = item.discountPrice * quantity;

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const existingItem = cart.items.find(
            item => item.productId.toString() === req.params.productId
        );

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== req.params.productId
        );

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        cart.totalItems = 0;
        cart.totalAmount = 0;
        cart.totalSaving = 0;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};