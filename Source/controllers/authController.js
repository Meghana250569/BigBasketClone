const OtpModel=require("../models/otp")
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/userModel");
const sendOtp = require("../utils/otpGenerate");



exports.generateOtp = async (req, res) => {
    console.log(require.resolve("../models/otp"));
    console.log("OtpModel:", OtpModel);
    console.log("Type:", typeof OtpModel);
    console.log("deleteMany:", OtpModel.deleteMany);

  try {

    const { email, phoneNumber } = req.body;

    if (!email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Email and Phone Number are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(require.resolve("../utils/otpGenerate"));
    console.log(OtpModel);
    console.log(typeof OtpModel);
   await  OtpModel.deleteMany({ email, phoneNumber });

    await  OtpModel.create({
      email,
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    console.log(sendOtp);
    console.log(typeof sendOtp);
    await sendOtp(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, phoneNumber, otp } = req.body;
    console.log("verify req body:", req.body);
    if (!email || !phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, phone number and OTP are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const otpRecord = await OtpModel.findOne({ email, phoneNumber, otp });

    console.log("OTP Record:", otpRecord);


    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "OTP expired"
      });
    }

    let user = await User.findOne({ email });
    console.log("User:", user);
    if (!user) {
      user = await User.create({
        name: "New User",
        email,
        phoneNumber,
        isVerified: true
      });
    } else {
      user.isVerified = true;
      await user.save();
    }
    console.log("JWT Secret:", process.env.JWT_SECRETE);
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRETE,
      { expiresIn: "7d" }
    );

    await OtpModel.deleteMany({ email, phoneNumber });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};