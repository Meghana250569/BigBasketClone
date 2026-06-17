const mongoose=require('mongoose')

const reviewSchema= new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"User",
        required:true
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
         ref:"Order",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    title:{
        type:String,
        trim:true,
        default:""

    },
    images:[{
        type:String

    }],
    isVerifiedPurchase:{
        type:Boolean,
        default:true
    }
},
    {
        timestamps:true
    }
);

reviewSchema.index(
    {productId:1, userId:1},
    {unique:true}
)

module.exports=mongoose.model("Review",reviewSchema)