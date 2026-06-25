const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const authenticate = require("../middleware/auth");

router.route("/")
    .post(authenticate, addToCart)
    .get(authenticate, getCart)
    .delete(authenticate, clearCart);

router.route("/:productId")
    .put(authenticate, updateCartItem)
    .delete(authenticate, removeCartItem);

module.exports = router;