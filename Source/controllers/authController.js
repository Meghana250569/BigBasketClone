const bcrypt = require("bcryptjs");
const User = require("../models/useModel");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
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
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
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
}