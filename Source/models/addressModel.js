const mongoose=require('mongoose')

const addressSchema= new mongoose.Schema({
        userId:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        fullName:String,
        phoneNumber:String,
        houseNo:String,
        street:String,
        landmark:String,
        city:String,
        pincode:String,
        isDefault:{
            type:Boolean,
            default:false
        }
},
        {
            timestamps:true
        }
)

module.exports=mongoose.model("Address",addressSchema)