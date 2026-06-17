const mongoose=required('mongoose')

const subCategory=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    image:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
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

module.exports=mongoose.model("SubCategory",subCategory)