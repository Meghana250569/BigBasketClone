const express =require('express')
const router=express.Router();

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}=require('../controllers/categoryController')

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post(
    "/",
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