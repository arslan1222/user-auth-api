const express = require("express");
const router = express.Router();

const {body} = require("express-validator");
const { authRoutes } = require('../middleware/auth');
const { getProfile, logout, updateProfile, changePassword, register, loginUser } = require("../controllers/authController");


const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
        .isLength({max: 20}).withMessage("Name cannot exceed 20 charcters"),
    body("email")
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, loginUser);

// Protected Routes
router.get("/me", authRoutes, getProfile);
router.post("/logout", authRoutes, logout);
router.post("/profile", authRoutes, updateProfile);
router.post("/change-password", authRoutes, changePassword);

module.exports = router;