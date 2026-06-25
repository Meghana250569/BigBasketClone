const express =require('express');
const router=express.Router();

const {
     getUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
}=require('../controllers/userController')

const authMiddleware=require('../middleware/auth');
const authorize=require('../middleware/authorize');


router.get("/",
    authMiddleware,
    authorize("admin"),
    getUsers
)

router.get("/:id",
    authMiddleware,
    authorize("admin"),
    getUserById
)


router.delete(
    "/:id",
   authMiddleware,
    authorize("admin"),
    deleteUser
);

router.patch(
    "/:id/role",
    authMiddleware,
    authorize("admin"),
    changeUserRole
);

router.put(
    "/:id",
    authMiddleware,
    updateUser
);

module.exports=router;

