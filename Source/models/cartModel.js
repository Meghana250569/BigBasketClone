

const mongoose=require('mongoose')

const cartSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       unique:true
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        productName:{
            type:String,
            required:true
        },
        productImage:{
            type:String,
            default:""
        },
        quantity:{
            type:Number,
            required:true,
            default:1,
            min:1
        },
        unit:{
            type:String,
            default:""
        },
        price:{
            type:Number,
            required:true
        },
        discountPrice:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            required:true
        }
    }],
    totalItems:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    },
    totalSaving:{
        type:Number,
        default:0
    }
},
    {
        timestamps:true
    }
)

module.exports=mongoose.model("Cart",cartSchema)