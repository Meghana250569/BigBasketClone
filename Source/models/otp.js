console.log("otp.js loading...");


const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      expires:0
    }
  },
  { timestamps: true }
);

console.log("Before export");
module.exports = mongoose.model("Otp", otpSchema);
console.log("After export");