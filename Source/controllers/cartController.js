const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calculateCartTotals = (cart) => {
  cart.totalItems = cart.items.length;

  cart.totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cart.subtotal = cart.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  cart.totalSaving = cart.items.reduce(
    (sum, item) => sum + item.savedAmount,
    0
  );

  
  cart.deliveryCharge = cart.subtotal >= 500 ? 0 : 40;

  cart.totalAmount =
    cart.subtotal -
    (cart.couponDiscount || 0) +
    cart.deliveryCharge;

  return cart;
};


const addToCart = async (req, res) => {
  try {
    const {
      productId,
      variantId,
      quantity = 1,
    } = req.body;

    if (!productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Variant ID are required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Product is currently unavailable",
      });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} item(s) available`,
      });
    }

    let cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: `Maximum available quantity is ${variant.stock}`,
        });
      }

      existingItem.quantity = newQuantity;

      existingItem.totalPrice =
        existingItem.quantity *
        variant.sellingPrice;

      existingItem.savedAmount =
        existingItem.quantity *
        (variant.mrp - variant.sellingPrice);

      existingItem.stock = variant.stock;
    } else {
      cart.items.push({
        productId,
        variantId,
        productName: product.name,
        productImage: product.images[0] || {},
        unit: variant.unit,
        quantity,
        mrp: variant.mrp,
        sellingPrice: variant.sellingPrice,
        totalPrice:
          quantity * variant.sellingPrice,
        savedAmount:
          quantity *
          (variant.mrp - variant.sellingPrice),
        stock: variant.stock,
        deliveryTime:
          product.deliveryTime || "8 MINS",
        isAvailable: product.isAvailable,
      });
    }

    calculateCartTotals(cart);

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });

  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate({
      path: "items.productId",
      select: "name images isAvailable",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });

  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const increaseQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (item.quantity + 1 > variant.stock) {
      return res.status(400).json({
        success: false,
        message: "Stock limit reached",
      });
    }

    item.quantity += 1;
    item.stock = variant.stock;
    item.mrp = variant.mrp;
    item.sellingPrice = variant.sellingPrice;
    item.totalPrice = item.quantity * variant.sellingPrice;
    item.savedAmount =
      item.quantity * (variant.mrp - variant.sellingPrice);

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity increased",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const decreaseQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (cart.items[itemIndex].quantity === 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
      cart.items[itemIndex].totalPrice =
        cart.items[itemIndex].quantity *
        cart.items[itemIndex].sellingPrice;

      cart.items[itemIndex].savedAmount =
        cart.items[itemIndex].quantity *
        (cart.items[itemIndex].mrp -
          cart.items[itemIndex].sellingPrice);
    }

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity updated",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const product = await Product.findById(productId);

    const variant = product.variants.id(variantId);

    if (quantity > variant.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available`,
      });
    }

    item.quantity = quantity;
    item.stock = variant.stock;
    item.mrp = variant.mrp;
    item.sellingPrice = variant.sellingPrice;
    item.totalPrice = quantity * variant.sellingPrice;
    item.savedAmount =
      quantity * (variant.mrp - variant.sellingPrice);

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const removeCartItem = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          item.variantId.toString() === variantId
        )
    );

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
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

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changeDeliveryType = async (req, res) => {
  try {

    const { deliveryType } = req.body;

    if (!["NOW", "LATER"].includes(deliveryType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery type",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.deliveryType = deliveryType;

    if (deliveryType === "NOW") {
      cart.estimatedDelivery = "5 mins";
    } else {
      cart.estimatedDelivery = "Scheduled";
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Delivery type updated",
      data: cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const applyCoupon = async (req, res) => {

  try {

    const { couponCode } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code required",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    
    let discount = 0;

    switch (couponCode.toUpperCase()) {

      case "WELCOME100":
        discount = 100;
        break;

      case "SAVE50":
        discount = 50;
        break;

      case "BB10":
        discount = cart.subtotal * 0.10;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
    }

    cart.couponCode = couponCode.toUpperCase();
    cart.couponDiscount = Math.round(discount);

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const removeCoupon = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.couponCode = "";
    cart.couponDiscount = 0;

    calculateCartTotals(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
      data: cart,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

const validateCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `${item.productName} no longer exists`,
        });
      }

      const variant = product.variants.id(item.variantId);

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant unavailable for ${product.name}`,
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is unavailable`,
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${variant.stock} item(s) left`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Cart validated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const checkoutCart = async (req, res) => {
  try {
    const {
      addressId,
      paymentMethod,
    } = req.body;

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    
    for (const item of cart.items) {

      const product = await Product.findById(item.productId);

      const variant = product.variants.id(item.variantId);

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

     
      variant.stock -= item.quantity;

      await product.save();
    }

    const order = await Order.create({
      userId: req.user.id,

      items: cart.items,

      addressId,

      subtotal: cart.subtotal,

      deliveryCharge: cart.deliveryCharge,

      couponDiscount: cart.couponDiscount,

      totalSaving: cart.totalSaving,

      totalAmount: cart.totalAmount,

      paymentMethod,

      orderStatus: "Pending",

      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : "Initiated",
    });

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

module.exports = {
  calculateCartTotals,
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeCartItem,
  clearCart,
  changeDeliveryType,
  applyCoupon,
  removeCoupon,
  validateCart,
  checkoutCart
};