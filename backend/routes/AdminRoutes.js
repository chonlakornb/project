const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const User = require('../models/user');
const Report = require('../models/report');
const Request = require('../models/request');
const Building = require('../models/building');
const authenticateToken = require('../middleware/middleware');

//admin dashboard show all statics
router.get('/overview', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.countDocuments();
        const users = await User.countDocuments();
        const technicians = await User.countDocuments({ role: 'employee' });
        const reports = await Report.countDocuments();
        const requests = await Request.countDocuments();
        const buildings = await Building.countDocuments();
        res.json({ notifications, users, reports, requests, buildings, technicians });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/buildings', authenticateToken, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const buildings = await Building.find()
        .populate('elevator')
        .populate('owner');
        res.json(buildings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find()
        .populate('user')
        .populate('building')
        .populate('assignedEmployee');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//assign employee to request
router.put('/request/:id/assign', authenticateToken, async (req, res) => {

  if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Only admin can assign work' });
    }

    const { assignedEmployee } = req.body; 
    // ต้องส่งเป็น employeeId เช่น: "673ab1239f1234abcd567890"

    try {
        // 1) ตรวจสอบก่อนว่า employee มีอยู่จริงไหม
        const employee = await User.findOne({ _id: assignedEmployee, role: 'employee' });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // 2) อัปเดต request
        const updated = await Request.findByIdAndUpdate(
            req.params.id,
            {
                assignedEmployee: employee._id,   // ⬅️ ต้องใช้ id เท่านั้น!!
                status: 'assigned'
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json({
            message: 'Work assigned successfully',
            request: updated
        });

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

router.get('/users/technician', authenticateToken , async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
        const users = await User.find({ role: 'employee' });
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