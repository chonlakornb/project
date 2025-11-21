const express = require('express');
const router = express.Router();
const Notification = require('../models/notifications');
const Report = require('../models/report');
const Request = require('../models/request');
const Building = require('../models/building');
const authenticateToken = require('../middleware/middleware');
const building = require('../models/building');

router.get('/overview', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.countDocuments({owner: req.userId});
        const reports = await Report.countDocuments({building: req.userId});
        const requests = await Request.countDocuments({user: req.userId});
        const buildings = await Building.countDocuments({owner: req.userId});
        res.json({ notifications, reports, requests, buildings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

 router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const buildingId = req.query.buildingId;
    let reports;
    // ผู้ใช้พนักงาน จะเห็นเฉพาะรายงานที่มอบหมายให้ตัวเอง
    if (req.userRole === 'employee') {
      if (buildingId) {
        reports = await Report.find({ building: buildingId, assignedEmployee: req.userId })
          .populate('building')
          .populate('employee');
      } else {
        reports = await Report.find({ assignedEmployee: req.userId })
          .populate('building')
          .populate('employee');
      }
    } else if (req.userRole === 'admin') {
      // admin เห็นทุก report (หรือกรองตาม building ถ้ามี)
      if (buildingId) {
        reports = await Report.find({ building: buildingId }).populate('building').populate('employee');
      } else {
        reports = await Report.find().populate('building').populate('employee');
      }
    } else {
      // เจ้าของอาคาร (user) เห็น report ของอาคารที่ตนเป็นเจ้าของ
      if (buildingId) {
        reports = await Report.find({ building: buildingId }).populate('building').populate('employee');
      } else {
        const userBuildings = await Building.find({ owner: req.userId }, '_id');
        const ids = userBuildings.map((b) => b._id);
        reports = await Report.find({ building: { $in: ids } }).populate('building').populate('employee');
      }
    }

    return res.json(reports);
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
});

router.get('/requests',authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const requests = await Request.find({ user: userId })
        .populate('user')
        .populate('building')
        .populate('assignedEmployee');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;