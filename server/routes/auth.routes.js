import express from "express";
import { allUsers, changePassword, forgotPassword, loginUser, registerUser, resetPassword,logoutUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/authMiddlewares/varifyToken.middlewares.js";
import { roleChecker } from "../middlewares/authMiddlewares/roleChecker.middlewares.js";

const authRouter=express.Router()

//register and login routes
authRouter.route('/register').post(verifyToken,roleChecker(["super_admin"]),registerUser)
authRouter.route('/login').post(loginUser)
authRouter.route('/logout').post(verifyToken,logoutUser)

// get all users route - only super admin can access
authRouter.route('/alluser').get(verifyToken,roleChecker(["super_admin"]),allUsers)


// change password
authRouter.route('/change-password').post(verifyToken, changePassword)
authRouter.route('/forget-password').post(forgotPassword)
authRouter.route('/reset-password/:token').post(resetPassword)



export default authRouter