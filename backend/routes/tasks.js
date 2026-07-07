const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Get all tasks for the logged in user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status, category, priority, dueDate, reminder } = req.body;
        const newTask = new Task({
            title,
            description,
            status: status || 'pending',
            category: category || 'Personal',
            priority: priority || 'Medium',
            dueDate: dueDate || null,
            reminder: reminder || null,
            user: req.user.id
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        // If being marked complete, set completedAt
        if (req.body.status === 'completed') {
            req.body.completedAt = new Date();
        } else if (req.body.status && req.body.status !== 'completed') {
            req.body.completedAt = null;
        }
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
