const mongoose = require('mongoose')
const { timeStamp } = require('node:console')
const { type } = require('node:os')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        reuired:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        select:false,


    },
    role:{
        type:String,
        enum:["customer","vendor"],
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
