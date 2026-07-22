const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Address = require("../models/addressModel");

const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);

  return `BB${Date.now()}${random}`;
};


const placeOrder = async (req, res) => {
  try {
    const {
      addressId,
      paymentMethod,
    } = req.body;

    if (!addressId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Address and payment method are required",
      });
    }

    
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    
    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    
    for (const item of cart.items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.productName} not found`,
        });
      }

      const variant = product.variants.id(item.variantId);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${variant.stock} item(s) left`,
        });
      }
    }

    
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
        state: address.state,
        pincode: address.pincode,
      },

      subTotal: cart.subtotal,

      deliveryCharges: cart.deliveryCharge,

      discountAmount: cart.couponDiscount,

      totalSaving: cart.totalSaving,

      totalAmount: cart.totalAmount,

      paymentMethod,

      paymentStatus:
        paymentMethod === "COD"
          ? "PENDING"
          : "PENDING",

      status: "PLACED",

      deliveryType: cart.deliveryType,

      estimatedDelivery: cart.estimatedDelivery,
    });

    
    for (const item of cart.items) {

      const product = await Product.findById(item.productId);

      const variant = product.variants.id(item.variantId);

      variant.stock -= item.quantity;

      await product.save();
    }

    
    cart.items = [];
    cart.totalItems = 0;
    cart.totalQuantity = 0;
    cart.subtotal = 0;
    cart.totalSaving = 0;
    cart.deliveryCharge = 0;
    cart.couponCode = "";
    cart.couponDiscount = 0;
    cart.totalAmount = 0;

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("addressId");

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const getOrderById = async (req, res) => {

  try {

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("addressId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


const cancelOrder = async (req, res) => {

  try {

    const { cancellationReason } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.status === "DELIVERED" ||
      order.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.status}`,
      });
    }

    
    for (const item of order.items) {

      const product = await Product.findById(item.productId);

      if (!product) continue;

      const variant = product.variants.id(item.variantId);

      if (!variant) continue;

      variant.stock += item.quantity;

      await product.save();
    }

    order.status = "CANCELLED";

    order.cancelledAt = new Date();

    order.cancellationReason =
      cancellationReason || "Cancelled by customer";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("userId", "firstName lastName email phone")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedStatus = [
      "PLACED",
      "CONFIRMED",
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    order.status = status;

    switch (status) {
      case "CONFIRMED":
        order.confirmedAt = new Date();
        break;

      case "PACKED":
        order.packedAt = new Date();
        break;

      case "SHIPPED":
        order.shippedAt = new Date();
        break;

      case "DELIVERED":
        order.deliveredAt = new Date();
        order.paymentStatus = "SUCCESS";
        break;

      case "CANCELLED":
        order.cancelledAt = new Date();
        break;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const deleteOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};