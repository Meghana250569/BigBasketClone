const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reuired:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        
        lowercase:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:true,
        
        trim:true
    },
   

    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
   { timestamps:true}
);

module.exports=mongoose.model("User",userSchema);
