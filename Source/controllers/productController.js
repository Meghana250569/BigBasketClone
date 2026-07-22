const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const slugify = require("slugify");

// ======================
// Create Product
// ======================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      categoryId,
      subCategoryId,
      description,
      about,
      sourcing,
      storage,
      highlights,
      tags,
      searchKeywords,
      images,
      variants,
      offerText,
      deliveryTime,
      otherInfo,
      isBestSeller,
      isFeatured,
      isTrending,
      metaTitle,
      metaDescription
    } = req.body;

    if (
      !name ||
      !categoryId ||
      !subCategoryId ||
      !description ||
      !about ||
      !variants?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
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
        message: "Sub Category not found.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    const existing = await Product.findOne({ slug });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already exists.",
      });
    }

    
    const product = await Product.create({
      name,
      slug,
      brand,
      categoryId,
      subCategoryId,
      description,
      about,
      sourcing,
      storage,
      highlights,
      tags,
      searchKeywords,
      images,
      variants,
      offerText,
      deliveryTime,
      otherInfo,
      isBestSeller,
      isFeatured,
      isTrending,
      metaTitle,
      metaDescription,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      featured,
      trending,
      bestseller,
      page = 1,
      limit = 12,
      search,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (category) filter.categoryId = category;
    if (subCategory) filter.subCategoryId = subCategory;
    if (featured) filter.isFeatured = featured;
    if (trending) filter.isTrending = trending;
    if (bestseller) filter.isBestSeller = bestseller;

    if (search) {
      filter.$text = {
        $search: search,
      };
    }

    const mongoose = require("mongoose");

    console.log("Registered models:", mongoose.modelNames()); 
    const products = await Product.find(filter)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProductsBySubCategory = async (req, res) => {
     console.log("Subcategory route hit:", req.params.subCategoryId);
  try {
    const { subCategoryId } = req.params;
     console.log("Controller Hit");
    console.log("SubCategory ID:", subCategoryId);

    console.log("Before Product.find");
    const products = await Product.find({
      subCategoryId,
      isActive: true,
    });
    console.log("After Product.find");
    console.log("Products Found:", products.length);
    console.log(products);
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name")
      .populate("subCategoryId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Get Product By Slug
// ======================
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("categoryId", "name")
      .populate("subCategoryId", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Update Product
// ======================
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// Soft Delete Product
// ======================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};