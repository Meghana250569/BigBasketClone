const mongoose=require('mongoose')

const paymentSchema= new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true

    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:0
    },
    paymentMethod:{
        type:String,
        enum:[
            "COD",
            "CARD",
            "UPI",
            "NETBANKING",
        ],
        required:true
    },
    paymentGateway:{
        type:String,
        enum:[
            "PHONEPE",
            "GPAY",
            "PAYTM",
            "RAZORPAY",
            "SLICE",
            "AMAZONPAY",
            "NONE"
        ],
        default:"NONE"
    },
    transactionId:{
        type:String,
        default: null
    },
    gatewayOrderid:{
        type:String,
        default: null
    },
    gatewayPaymentId:{
        type:String,
        default: null
    },
    paymentStatus:{
        type:Sttring,
        enum:[
            "PENDING",
            "SUCCEESS",
            "FAILED",
            "REFUNDED"
        ],
        default:"PWNDING"
    },

    paidAt:{
        type:Date
    },

    refundAmount:{
        type:Number,
        default:0
    },
    refundedAt:{
        type:Date
    },
    failureReason:{
        type:String,
        default:""
    }
},
    {
        timestamps:true
    }
)

module.exports=mongoose.model("Payment",paymentSchema)