const mongoose = require("mongoose");

const productTypeModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }

  
);

productTypeModel.index(
  { subCategoryId: 1, name: 1 },
  { unique: true }
);

module.exports = mongoose.model("producttype", productTypeModel);