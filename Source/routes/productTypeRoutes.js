const express = require("express");
const router = express.Router();

const {
  createProductType,
  getProductTypes,
  getProductTypeById,
  updateProductType,
  deleteProductType,
} = require("../controllers/productTypeController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");


router.post(
  "/createProductType",
  authenticate,
  authorize("admin"),
  createProductType
);


router.get("/getProductTypes", getProductTypes);


router.get("/getProductType/:id", getProductTypeById);


router.put(
  "/updateProductType/:id",
  authenticate,
  authorize("admin"),
  updateProductType
);


router.delete(
  "/deleteProductType/:id",
  authenticate,
  authorize("admin"),
  deleteProductType
);

module.exports = router;