const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  changeDeliveryType,
  validateCart,
  checkoutCart,
} = require("../controllers/cartController");

const authenticate = require("../middleware/auth");


router.get("/", authenticate, getCart);


router.post("/add", authenticate, addToCart);


router.patch(
  "/increase/:productId/:variantId",
  authenticate,
  increaseQuantity
);

router.patch(
  "/decrease/:productId/:variantId",
  authenticate,
  decreaseQuantity
);


router.patch(
  "/update/:productId/:variantId",
  authenticate,
  updateQuantity
);

router.delete(
  "/remove/:productId/:variantId",
  authenticate,
  removeCartItem
);


router.delete("/clear", authenticate, clearCart);


router.post(
  "/apply-coupon",
  authenticate,
  applyCoupon
);


router.delete(
  "/remove-coupon",
  authenticate,
  removeCoupon
);


router.patch(
  "/delivery-type",
  authenticate,
  changeDeliveryType
);

router.get(
  "/validate",
  authenticate,
  validateCart
);


router.post(
  "/checkout",
  authenticate,
  checkoutCart
);

module.exports = router;