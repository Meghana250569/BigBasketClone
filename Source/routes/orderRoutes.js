const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus
} = require("../controllers/orderController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.route("/")
    .post(authenticate, createOrder)
    .get(authenticate, getOrders);

router.route("/:id")
    .get(authenticate, getOrderById);

router.patch(
    "/:id/cancel",
    authenticate,
    cancelOrder
);

router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    updateOrderStatus
);

module.exports = router;