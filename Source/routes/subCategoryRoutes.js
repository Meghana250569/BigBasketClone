const express =require('express')
const router=require('Router')

const {
   createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
}=require('../controllers/subCategoryController')

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { getCategoryById } = require('../controllers/categoryController');

router.get("/", getSubCategories);

router.get("/:id",getCategoryById)

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createSubCategory
);

router.put(
    "/id",
    authenticate,
    authorize("admin"),
    updateSubCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    deleteSubCategory
);

module.exports=router;