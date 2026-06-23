const bcrypt = require("bcryptjs");
const validator=require('validator')
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { name, email, phoneNumber, password,role } = req.body;

        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Please provide a valid email address"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                success:false,
                message:"Password length must atleast 6 characters"
            });
        }
        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email:email.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            role
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phoneNumber,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:",error)
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




exports.login=async (req,res)=>{
    try {
        const {email,password}=req.body

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json(
                {success:false,
                message:"Invalid Credentials"}
            );
        }

        const isMatch=await bcrypt.compare(
            password,
            user.password
        )
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token=generateToken(user)

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

exports.getProfile=async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }
        res.status(200).json({
            success:true,
            data:user
        });
 
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};