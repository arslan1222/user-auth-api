const User = require("../models/User");
const jwt = require("jsonwebtoken");


const authRoutes = async (req, res, next) =>{
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, Please login."
            })
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find User
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found. Please Login"
            })
            
        };

        // Attach user to request
        req.user = user;
        req.token = token;
        next();


    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.',
            });
            }
            if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.',
            });
        }
    }
}

// Optional: Role-based middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = {authRoutes, authorize};