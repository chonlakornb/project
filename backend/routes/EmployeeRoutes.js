const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const User = require('../models/user');
const Report = require('../models/report');
const Request = require('../models/request');
const Building = require('../models/building');
const authenticateToken = require('../middleware/middleware');

router.get('/overview', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.countDocuments({receiver: req.userId});
        const reports = await Report.countDocuments({employee: req.userId});
        const requests = await Request.countDocuments({assignedEmployee: req.userId});
        res.json({ notifications, reports, requests });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/requests',authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await Request.find({ assignedEmployee: userId })
        .populate('user')
        .populate('building')
        .populate('assignedEmployee');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;