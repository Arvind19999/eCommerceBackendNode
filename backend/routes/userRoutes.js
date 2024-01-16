const express = require("express")
const { userRegister,
         userLogin, 
         userLoggedOut, 
         forgetPassword, 
         resetPassword, 
         getUserProfile, 
         updatePassword,
         updateProfile,
         getAllUsers,
         getSingleUser,
         updateRole,
         deleteUser
        } = require("../controllers/userController")

const { isAuthenticated,authorizeRole} = require("../middleware/auth");


const router = express.Router()

router.post("/user/register",userRegister);

router.post("/user/login",userLogin);

router.post("/user/logout",userLoggedOut);

router.post("/user/forget/password",forgetPassword);

router.post("/user/reset/password/:token",resetPassword);

router.get("/user/profile/me",isAuthenticated,getUserProfile);

router.put("/user/update/password",isAuthenticated,updatePassword);

router.put("/user/update/profile/me",isAuthenticated,updateProfile);

router.get("/user/admin/users",isAuthenticated,authorizeRole("admin"),getAllUsers);

router.get("/user/admin/user/:id",isAuthenticated,authorizeRole("admin"),getSingleUser);

router.put("/user/admin/update/role/:id",isAuthenticated,authorizeRole("admin"),updateRole);

router.delete("/user/admin/delete/user/:id",isAuthenticated,authorizeRole("admin"),deleteUser
);

module.exports  = router;