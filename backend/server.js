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

const { MongoMemoryServer } = require('mongodb-memory-server');

const startServer = async () => {
    try {
        if (!MONGO_URI) {
            console.warn("⚠️ MONGO_URI is not defined! Starting in-memory database...");
            const mongoServer = await MongoMemoryServer.create();
            await mongoose.connect(mongoServer.getUri());
            console.log('Connected to In-Memory MongoDB');
        } else {
            try {
                await mongoose.connect(MONGO_URI);
                console.log('MongoDB Atlas connected');
            } catch (err) {
                console.error(`Atlas Connection Failed (${err.message}). Starting temporary In-Memory MongoDB...`);
                const mongoServer = await MongoMemoryServer.create();
                await mongoose.connect(mongoServer.getUri());
                console.log('Connected to In-Memory MongoDB successfully!');
            }
        }
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

startServer();
