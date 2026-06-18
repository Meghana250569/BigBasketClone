const Product=require('../models/productModel')
const Category=require('../models/categoryModel')
const SubCategory=require('../models/subcategoryModel')

exports.createProduct=async (req,res) => {
    try {
        const {
            name,
            description,
            brand,
            categoryId,
            subCategoryId,
            price,
            discountPrice,
            stock,
            unit,
            quantity,
            images
        } = req.body;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const subCategory = await SubCategory.findById(subCategoryId);

        if(!subCategory){
            return res.status(404).json({
                success:false,
                message:"SubCategory not found"
            });
        }

        const product= await Product.create({
            name,
            description,
            brand,
            categoryId,
            subCategoryId,
            price,
            discountPrice,
            stock,
            unit,
            quantity,
            images
        });

        res.status(201).json({
            success:true,
            message:"Product Added successfully",
            data:product
        });
    } catch (error) {
        re.status(500).json({
            success:false,
            message:error.message
        });
    }
}

exports.getProducts=async (req,res)=>{
    try {
        const products= await Product.find()
            .populate("categoryId","name")
            .populate("subCategoryId","name")
            .sort({createdAt:-1});
        
        res.status(200).json({
            success:true,
            count:products.length,
            data:products
        });
    } catch (error) {
        res.status(500).json({
            success:fasle,
            message:error.message
        })
    }
};

exports.getProductById=async (req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
            .populate("categoryId","name")
            .populate("subCategoryId","name")
        
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product Not Found"
            });
        }
        res.status(200).json({
            success:true,
            data:product
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

exports.updateProduct=await (req,res) =>{
       try {
         const product=await Product.findByIdAndUpdate(req.params.id,
            req.body,
            {
             new:true,
             runValidators:true
            } );
       } catch (error) {
        
       }
        
}