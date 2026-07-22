const Category=require('../models/categoryModel')
const SubCategory=require('../models/subcategoryModel')

exports.createSubCategory= async (req,res) =>{
    try {
        const {
            name,
            categoryId
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

        const subCategory= await SubCategory.create({name,categoryId});
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

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    const filter = { isActive: true };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    console.log("Filter:", filter);

    const subCategories = await SubCategory.find(filter);

    console.log("Found:", subCategories);

    res.status(200).json({
      success: true,
      data: subCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(
            req.params.id
        ).populate("categoryId", "name");

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "SubCategory not found"
            });
        }

        res.status(200).json({
            success: true,
            data: subCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSubCategory = async (req, res) => {
    try {
        const { name, categoryId, isActive } = req.body;

        if (categoryId) {
            const category = await Category.findById(categoryId);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }
        }

        const subCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            {
                name,
                categoryId,
                
                isActive
            },
            {
                new: true,
                runValidators: true
            }
        ).populate("categoryId", "name");

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "SubCategory not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "SubCategory updated successfully",
            data: subCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(
            req.params.id
        );

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "SubCategory not found"
            });
        }

        await subCategory.deleteOne();

        res.status(200).json({
            success: true,
            message: "SubCategory deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};