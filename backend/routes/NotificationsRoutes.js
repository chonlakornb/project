const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const authenticateToken = require('../middleware/middleware');

//see notification for users
router.get('/',authenticateToken, async (req, res) => {
        try {
            const notifications = await Notification.find({ receiver: req.userId });
            res.json(notifications);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching notifications', error: err.message });
        }
    });

//post a notification by admin or system
router.post('/', authenticateToken, async (req, res) => {
    const {message, receiver, type} = req.body
    try {
        const newNotification = new Notification({
            message,
            receiver,
            type,
            sender: req.userId
        });
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Only admin users can create notifications.' });
        }
        await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
    } catch (err) {
        res.status(500).json({ message: 'Error creating notification', error: err.message });
    }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
   try {
        const updated = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json({ message: "Notification marked as read", notification: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting notification', error: err.message });
    }
});

module.exports = router;