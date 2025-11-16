const express = require('express');
const router = express.Router();
const Building = require('../models/building');

const authenticateToken = require('../middleware/middleware');

// Admin can see all buidling and Users can only see their own building
router.get('/',authenticateToken, async (req, res) => {
   try {
    let query = {};
    if (req.userRole !== 'admin') {
      query.owner = req.userId; // filter สำหรับ user/employee
    }

    const buildings = await Building.find(query)
      .populate('owner', 'fullName email'); // แสดงเฉพาะชื่อและอีเมลของ owner

    res.status(200).json(buildings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching buildings' });
  }
});

//get building by id and details (user can see thier own building and admin can see all building)
router.get('/:id',authenticateToken, async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }
        res.json(building);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }
        const updatedBuilding = await Building.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
    res.json({message:'Building updated successfully',updatedBuilding});
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

//admin or user can delete
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) {
            return res.status(404).json({ message: 'Building not found' });
        }
        await Building.findByIdAndDelete(req.params.id);
        res.json({ message: 'Building deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post('/', authenticateToken, async (req, res) => {
    const userId = req.userId;

    const { name, address, region, type  } = req.body;

    try {
        const newBuilding = new Building({
            name,
            type,
            address,
            region,
            owner: userId
        });

        await newBuilding.save();
        res.status(201).json({ message: 'Building created successfully', building: newBuilding });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;