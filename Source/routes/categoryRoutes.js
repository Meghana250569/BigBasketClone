const express =require('express')
const router=express.Router();

const {
    createCategory,
    getCategories,
    getCategoriesWithSubCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}=require('../controllers/categoryController')

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", getCategories);
router.get(
  "/with-subcategories",
  getCategoriesWithSubCategories
);
router.get("/:id", getCategoryById);

router.post(
    "/createCategory",
    authenticate,
    authorize("admin"),
    createCategory
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteCategory
);
module.exports = router;