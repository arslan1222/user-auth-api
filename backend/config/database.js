const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Database Connected Successfully!")
        
    } catch (error) {
        console.error("Database Connection Failed!!", error.message);
        process.getMaxListeners(1);
    }
}

module.exports = connectDB;