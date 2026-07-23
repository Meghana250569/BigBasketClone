const express=require('express')
const router=express.Router()

const {
    createProduct,
  getProducts,
  getProductById,
  getProductsBySubCategory,
  getProductBySlug,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", getProducts);

router.get("/slug/:slug", getProductBySlug);

router.get("/subcategory/:subCategoryId", getProductsBySubCategory);

router.get("/:id", getProductById);

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createProduct
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteProduct
);

module.exports=router;