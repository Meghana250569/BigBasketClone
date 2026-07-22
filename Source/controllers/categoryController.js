const Category= require('../models/categoryModel')

exports.createCategory= async (req,res) =>{
    try {
        const {name}=req.body;
        if(!name){
            return res.status(400).json({
                success:false,
                message:"Category name is required"
            });
        }

        const existingCategory=await Category.findOne({name});
        if(existingCategory){
            return res.status(409).json({
                success:false,
                message:"Category already exists"
            });
        }

        const Category = await Category.create({
            name
        });
        
        res.status(201).json({
            success:true,
            message:"Category created successfully",
            data:Category
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const category = await Category.find({
            isActive: true
        });

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getCategoriesWithSubCategories = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "subcategories", // MongoDB collection name
          localField: "_id",
          foreignField: "categoryId",
          as: "subCategories",
        },
      },
      {
        $project: {
          name: 1,
          images: 1,
          isActive: 1,
          subCategories: {
            $filter: {
              input: "$subCategories",
              as: "sub",
              cond: {
                $eq: ["$$sub.isActive", true],
              },
            },
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name,  isActive } = req.body;

        if (name) {
            const existingCategory = await Category.findOne({
                name: name.trim(),
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                return res.status(409).json({
                    success: false,
                    message: "Category name already exists"
                });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
               
                isActive
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(
            req.params.id
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};