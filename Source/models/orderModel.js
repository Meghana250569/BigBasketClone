const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    productImage: {
        type: String,
        default: ""
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    unit: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    }
});

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    houseNo: {
        type: String,
        required: true
    },

    street: {
        type: String,
        required: true
    },

    landmark: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        required: true
    },

    pincode: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderNumber: {
        type: String,
        required: true,
        unique: true
    },

    items: [orderItemSchema],

    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },

    shippingAddress: shippingAddressSchema,

    subTotal: {
        type: Number,
        required: true
    },

    deliveryCharges: {
        type: Number,
        default: 0
    },

    discountAmount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "UPI", "CARD", "NETBANKING"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "FAILED", "SUCCESS", "REFUNDED"],
        default: "PENDING"
    },

    status: {
        type: String,
        enum: [
            "PLACED",
            "CONFIRMED",
            "PACKED",
            "SHIPPED",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELED"
        ],
        default: "PLACED"
    },

    confirmedAt: Date,
    packedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,

    cancelledAt: Date,

    cancellationReason: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);