import express from "express";
const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import cookieParser from "cookie-parser";

router.use(cookieParser());
//  @swagger

// Import individual functions from the controller
import {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
    confirmEmail
} from "../controllers/authController.js";

// Define routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Export the router using ES module syntax
export default router;