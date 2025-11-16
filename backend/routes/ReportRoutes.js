const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const authenticateToken = require('../middleware/middleware');

router.post('/', authenticateToken, async (req, res) => {
    const { reportType, content, status, building } = req.body;
    try {
        const newReport = new Report({
            reportType,
            content,
            status,
            building,
            employee: req.userId
        })
        await newReport.save();
        res.status(201).json({ message: 'Report created successfully', report: newReport });
        if(req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.get('/', authenticateToken, async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
        if(req.userRole !== 'employee' && req.userRole !== 'admin'){
            res.status(403).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.put('/:id', authenticateToken, async (req, res) => {
    const { reportType, content, status, building } = req.body;
    try {
        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { reportType, content, status, building, employee: req.userId },
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        if(req.userRole !== 'admin'&& req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        res.json(updatedReport);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        if(req.userRole !== 'admin'&& req.userRole !== 'employee'){
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

module.exports = router;