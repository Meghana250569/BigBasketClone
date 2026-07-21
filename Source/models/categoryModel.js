const mongoose=require('mongoose')

const categorySchema=new  mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
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

console.log("Category model loaded");
module.exports=mongoose.model("category",categorySchema)