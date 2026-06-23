const express =require('express');
const router=express.Router();

const {
     getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
}=require('../controllers/userController')



