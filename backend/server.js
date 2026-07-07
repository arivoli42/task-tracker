const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Simple health check
app.get('/', (req, res) => {
    res.send('Task Tracker API is running');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Set this in your hosting provider (Render)

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            console.warn("⚠️ MONGO_URI is not defined! Ensure you have set it in your environment variables.");
        } else {
            await mongoose.connect(MONGO_URI);
            console.log('MongoDB Atlas connected');
        }
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

startServer();
