require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const router = require('./routes/authRoutes');
const app = express();

const PORT = process.env.PORT || 3000;


// MongoDB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/api/auth", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use("/", (req, res) => {
    res.send("I am a root");
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
});