const { validationResult } = require('express-validator');
const User = require('../models/User');

// Register new user
const register = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        // Check if user exists

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: true,
                message: "User already exists eith this email",
            });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
        });

        await user.save();

        // Generate Token
        const token = user.generateAuthToken();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: userResponse,
        })


    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message,
        });
    }
} 

// Login User
const loginUser = async (req, res) => {


    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if(!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Inalid Credentials",
            });
        }

        // Update last Llogin
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        // remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: userResponse,
        });


    } catch (error) {
        console.error("Login Error,", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
        })
    }
    

}

// Get currnet user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetcing profile",
            error: error.message,
        })
    }
}

// logout user
const logout = (req, res) => {

    // In JWT-based auth, logout is handled client-side
    // But we can invalidate token by adding it to a blacklist
    // For simplicity, we'll just send a success response

    try {
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during logout",
            error: error.message,
        })
    }
}

// Update user profile
const updateProfile = async (req, res) =>{
    try {
        const {name, email} = req.body;

        // Check if email is taken by another user
        if(email && email !== req.user.email) {
            const existingUser = await User.findOne({email});
            if(existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use by another account",
                })
            }
        }

        const user = await User.findById(req.user._id);
        if(name) user.name = name;
        if(email) user.email = email
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message,
        })
    }
}

// Change Password

const changePassword = async (req, res) => {
    try {
        const {currentPassword, newPassword } = req.body;

        // Validate
        if(!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide current and new password",
            })
        }

        // Find user with password
        const user = await User.findById(req.user._id).select("+password");

        // Verify current password

        const isPasswordMatch = await user.comparePassword(currentPassword);

        if(!isPasswordMatch) {
            if (!isPasswordMatch) {
                return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
    });
}
        }

        // Update password (with hashed by pre-save hook)

        user.password = newPassword;
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
            token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error changing password",
            error: error.message,
        })
        
    }
};

module.exports = {
    register,
    loginUser,
    getProfile,
    logout,
    updateProfile,
    changePassword,
}

