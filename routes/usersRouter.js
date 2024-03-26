import express from "express";
import { signupUser, loginUser } from "../controllers/usersController.js";

const router = express.Router();

// Login route ('/api/user/login')
router.post("/login", loginUser);

// Signup route ('/api/user/signup')
router.post("/signup", signupUser);

export { router as usersRouter };
