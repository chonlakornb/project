const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const authenticateToken = require('../middleware/middleware');

// Get own user buildings (must be logged in) and admin can get all buildings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userRole = req.userRole; // Assume userRole is set in the authenticateToken middleware
        let buildings;

        if (userRole === 'admin') {
            buildings = await Building.find({});
        } else {
            buildings = await Building.find({ ownerId: req.userId });
        }

        res.json(buildings);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, address } = req.body;

    try {
        const newBuilding = new Building({
            name,
            type,
            address,
            region,
            ownerId: req.userId
        });

        await newBuilding.save();
        res.status(201).json({ message: 'Building created successfully', building: newBuilding });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;