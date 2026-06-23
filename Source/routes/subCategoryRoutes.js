const express =require('express');
const router=express.Router();

const {
   createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory
}=require('../controllers/subCategoryController')

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");


router.get("/", getSubCategories);

router.get("/:id",getSubCategoryById)

router.post(
    "/",
    authenticate,
    authorize("admin"),
    createSubCategory
);

router.put(
    "/:id",
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