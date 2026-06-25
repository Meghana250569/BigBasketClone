const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");

const generateOrderNumber = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const random = Math.floor(1000 + Math.random() * 9000);

    return `BB-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

exports.createOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;

        if (!addressId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Address and payment method are required"
            });
        }

        const validMethods = ["COD", "UPI", "CARD", "NETBANKING"];

        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const address = await Address.findOne({
            _id: addressId,
            userId: req.user.id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const deliveryCharges = cart.totalAmount >= 499 ? 0 : 40;
        const discountAmount = cart.totalSaving;
        const totalAmount = cart.totalAmount + deliveryCharges;

        const order = await Order.create({
            userId: req.user.id,
            orderNumber: generateOrderNumber(),
            items: cart.items,
            addressId,
            shippingAddress: {
                fullName: address.fullName,
                phoneNumber: address.phoneNumber,
                houseNo: address.houseNo,
                street: address.street,
                landmark: address.landmark,
                city: address.city,
                pincode: address.pincode
            },
            subTotal: cart.totalAmount,
            deliveryCharges,
            discountAmount,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
            status: "PLACED"
        });

        cart.items = [];
        cart.totalItems = 0;
        cart.totalAmount = 0;
        cart.totalSaving = 0;

        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { cancellationReason } = req.body;

        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status === "CANCELED") {
            return res.status(400).json({
                success: false,
                message: "Order already cancelled"
            });
        }

        if (
            ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"]
                .includes(order.status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled now"
            });
        }

        order.status = "CANCELED";
        order.cancelledAt = new Date();
        order.cancellationReason = cancellationReason || "";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status === "CANCELED") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be updated"
            });
        }

        order.status = status;

        if (status === "CONFIRMED") {
            order.confirmedAt = new Date();
        }

        if (status === "PACKED") {
            order.packedAt = new Date();
        }

        if (status === "SHIPPED") {
            order.shippedAt = new Date();
        }

        if (status === "DELIVERED") {
            order.deliveredAt = new Date();
            order.paymentStatus = "SUCCESS";
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};