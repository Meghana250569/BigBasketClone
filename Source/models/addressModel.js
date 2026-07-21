const mongoose=require('mongoose')

const addressSchema= new mongoose.Schema({
        userId:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        fullName:{
            type:String,
            required:true,
            trim:true
        },
        phoneNumber:{
            type:String,
            required:true
        },
        houseNo:{
            type:String,
            required:true
        },
        street:{
            type:String,
            required:true
        },
        landmark:{
            type:String
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            
        },
        pincode:{
            type:String,
            required:true
        },
        addressType:{
            type:String,
            enum:["Home","Office","Others"],
            default:"Home"
        },
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