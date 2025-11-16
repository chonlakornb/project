const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const User = require('../models/user');
const Report = require('../models/report');
const Request = require('../models/request');
const Building = require('../models/building');

//admin dashboard show all statics
router.get('/overview', async (req, res) => {
    try {
        const notifications = await Notification.find();
        const users = await User.countDocuments();
        const reports = await Report.countDocuments();
        const requests = await Request.countDocuments();
        const buildings = await Building.countDocuments();
        res.json({ notifications, users, reports, requests, buildings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/request/:id/assign', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        request.assignedTo = req.body.assignedTo;
        await request.save();
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;