const express = require('express');
const User=require('../models/userModel')

exports.getUsers=async (req,res) => {
       try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getUserById= async (req,res) =>{
    try {
        const user=await User.findById(req.params.id).select("-password")
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

        res.status(200).json({
            success:true,
            data:user
        })
    } catch (error) {
        res.status(500).json({
            seccess:false,
            message:error.message
        });
    }
};

exports.updateUser=async (req,res) =>{
    try {
        const {name,phoneNumber}=req.body
        if(req.user.role !=="admin" && req.user._id.toString() !==req.params.id) {
            return res.status(403).json({
                seccess:false,
                message:"Access Forbidden"
            });
        }
        const user=await User.findByIdAndUpdate(req.params.id, {name,phoneNumber},{new:true, runValidators:true}).select("-password")
        if(!user){
            return res.status(404).json({
                seccess:false,
                message:"User Not Found"
            });
        }
        res.status(200).json({
            success:true,
            message:"User Updated Successfully",
            data:user
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

exports.deleteUser= async (req,res) =>{
    try{
    const user= await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User Not Found"
        });
    }
    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User deleted Successfully"
    });
}
catch(error){
    res.status(500).json({
        success:false,
        message:error.message
    });
}
};

exports.changeUserRole= async (req,res) =>{
    try {
        const {role}=req.body

        if(!["customer","admin"].includes(role)){
            return res.status(400).json({
                seccess:false,
                message:"Invalid Role"
            });
        }

        const user =await User.findByIdAndUpdate(req.params.id, {role},
                    {new:true,runValidators:true}).select("password")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User NOt Found"
            });
        }
        res.status(200).json({
            success:true,
            message:"User role updated successfully",
            data:user
        })
       
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
