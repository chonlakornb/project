const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const authenticateToken = require('../middleware/middleware');
const user = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {

    const { requestType, title, description, building } = req.body;
    try {
        const newRequest = new Request({
            requestType,
            title,
            description,
            building,
            user: req.userId
        })
        await newRequest.save();
        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.put('/:id/status', async (req, res) => {
    try {

        const updatedRequest = await Request.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if(user.role === 'admin', user.role = 'employee')
        res.json({message:'Status updated'},updatedRequest);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id/assign', async (req, res) => {
    try {
        const updatedRequest = await Request.findByIdAndUpdate(
            req.params.id,
            { assignedTo: req.body.assignedTo },
            { new: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//admin can delete
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (user.role !== 'admin' && !request) {
            return res.status(403).json({ message: 'Unauthorized or no request found' });
        }
        await Request.findByIdAndDelete(req.params.id);
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;