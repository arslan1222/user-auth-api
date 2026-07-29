const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(

    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
            minlength: [3, "Name must ne at least 3 characters"],
            max: [20, "Name cannot exceed 20 characters"]
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim : true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email"
            ],
        },

        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,

        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
        },
    },
    {timestamp: true,}



);

// Hasehd password before saving
userSchema.pre('save', async function() {
    if(!this.isModified("password")){
        return;
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUND || 10));
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Genrate JWT Token
userSchema.methods.generateAuthToken = function () {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { userId: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d'}
    )
}

module.exports = mongoose.model("User", userSchema);