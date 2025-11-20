const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const Report = require('../models/report');
const Request = require('../models/request');
const Building = require('../models/building');
const authenticateToken = require('../middleware/middleware');

router.get('/overview', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.countDocuments({owner: req.userId});
        const reports = await Report.countDocuments({owner: req.userId});
        const requests = await Request.countDocuments({owner: req.userId});
        const buildings = await Building.countDocuments({owner: req.userId});
        res.json({ notifications, reports, requests, buildings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;