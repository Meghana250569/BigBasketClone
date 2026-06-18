const Category=require('../models/categoryModel')
const SubCategory=require('../models/subcategoryModel')

exports.createSubCategory= async (req,res) =>{
    try {
        const {
            name,
            categoryId,
            image
        }=req.body

        if(!name || !categoryId){
            return res.status(400).json({
                success:false,
                message:"Name and categoryId are required"
            });
        }
        const category=await Category.findById(categoryId)
        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category Not found"
            });
        }

        const existingSubCategory= await SubCategory.findOne({name,categoryId });
        if(existingSubCategory){
            return res.status(409).json({
                success:false,
                message:"SubCategory already Exist"
            })
        };

        const subCategory= await SubCategory.create({name,categoryId,image});
        res.status(209).json({
            success:true,
            message:"SubCategory Created Succcessfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,

            message:error.message
        });
    }

}

exports.getSubCategory=async (req,res)=>{
    try {
        const subCategory=await SubCategory.find({isActive:true}).populate("categoryId","name")
        res.status(200).json({
            success:true,
            data:SubCategory
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}