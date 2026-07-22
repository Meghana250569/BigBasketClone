const ProductType = require("../models/ProductType");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");


exports.createProductType = async (req, res) => {
  try {
    const {
      name,
      slug,
      categoryId,
      subCategoryId,
      isActive,
    } = req.body;

    if (!name || !slug || !categoryId || !subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "All required fields are mandatory.",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const subCategory = await SubCategory.findById(subCategoryId);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found.",
      });
    }

    const exists = await ProductType.findOne({
      name,
      subCategoryId,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Product Type already exists.",
      });
    }

    const productType = await ProductType.create({
      name,
      slug,
      categoryId,
      subCategoryId,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Product Type created successfully.",
      data: productType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProductTypes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    if (req.query.subCategoryId) {
      filter.subCategoryId = req.query.subCategoryId;
    }

    const productTypes = await ProductType.find(filter)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: productTypes.length,
      data: productTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProductTypeById = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name");

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: productType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Type updated successfully.",
      data: productType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);

    if (!productType) {
      return res.status(404).json({
        success: false,
        message: "Product Type not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Type deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};