const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");


router.post("/place", authenticate, placeOrder);


router.get("/my-orders", authenticate, getMyOrders);

router.get("/:id", authenticate, getOrderById);

router.patch("/cancel/:id", authenticate, cancelOrder);




router.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllOrders
);


router.patch(
  "/status/:id",
  authenticate,
  authorize("admin"),
  updateOrderStatus
);


router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteOrder
);

module.exports = router;