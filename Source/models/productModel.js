const mongoose = require("mongoose");


const variantSchema = new mongoose.Schema(
  {
    unit: {
      type: String,
      required: true,
      trim: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },

    barcode: {
      type: String,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);


const otherInfoSchema = new mongoose.Schema(
  {
    eanCode: {
      type: String,
      trim: true,
    },

    manufacturer: {
      type: String,
      trim: true,
    },

    fssai: {
      type: String,
      trim: true,
    },

    countryOfOrigin: {
      type: String,
      trim: true,
    },

    shelfLife: {
      type: String,
      trim: true,
    },

    customerCare: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);


const productSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "fresho!",
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
      index: true,
    },

    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
      index: true,
    },

    productTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "producttype",
      required: true,
      index: true,
    },

    
    description: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      trim: true,
    },

    sourcing: {
      type: String,
      trim: true,
    },

    storage: [
      {
        type: String,
        trim: true,
      },
    ],

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    searchKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    
    images: {
  type: [
    {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
  validate: {
    validator: function (value) {
      return value.length > 0;
    },
    message: "At least one image is required.",
  },
},

   
    variants: {
      type: [variantSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one variant is required.",
      },
    },

   
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

   
    offerText: {
      type: String,
      default: "Har Din Sasta!",
    },

    
    deliveryTime: {
      type: String,
      default: "8 MINS",
    },

    
    otherInfo: otherInfoSchema,

    
    status: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK", "COMING_SOON"],
      default: "IN_STOCK",
    },

    
    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    
    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


productSchema.index({ categoryId: 1 });
productSchema.index({ subCategoryId: 1 });
productSchema.index({ productTypeId: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ status: 1 });


productSchema.index({
  name: "text",
  description: "text",
  about: "text",
  brand: "text",
});

module.exports = mongoose.model("product", productSchema);