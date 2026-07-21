const mongoose=require('mongoose')

const subCategory=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    

    isActive:{
        type:Boolean,
        default:true
    }
},
    {
        timestamps:true
    }
)

module.exports =
  mongoose.models.subcategory ||
  mongoose.model("subcategory", subCategory);