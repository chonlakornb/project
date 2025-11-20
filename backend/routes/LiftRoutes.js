const express = require('express');
const router = express.Router();
const Lift = require('../models/lift');
const authenticateToken = require('../middleware/middleware');

// find by building id
router.get('/',authenticateToken, async (req, res) => {
    try {
        const lifts = await Lift.find({ building: req.body.building });
        res.json(lifts);
        if(lifts.length === 0){
            return res.status(404).json({ message: 'Lifts not found or not installed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:id',authenticateToken, async (req, res) => {
    try {
        const lift = await Lift.findById(req.params.id);
        if (!lift) {
            return res.status(404).json({ message: 'Lift not found' });
        }
        res.json(lift);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/',authenticateToken, async (req, res) => {
    const { name, model, capacity, floorsServed, building,  } = req.body;
    try {
        if(req.userRole !== 'admin' && req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        const newLift = new Lift({ name, building, model, capacity, floorsServed });
        await newLift.save();
        res.status(201).json({ message: 'Lift created successfully', lift: newLift });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.put('/:id',authenticateToken, async (req, res) => {
    const { name, model, capacity, floorsServed, building } = req.body;

    try {
        const lift = await Lift.findById(req.params.id);
        if (!lift) {
            return res.status(404).json({ message: 'Lift not found' });
        }
        if(req.userRole !== 'admin' && req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        const updatedLift = await Lift.findByIdAndUpdate(
            req.params.id,
            { name, building, model, capacity, floorsServed },
            { new: true }
        );
        res.json({message:'Lift updated successfully',updatedLift});
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})

router.put('/:id/status',authenticateToken, async (req, res) => {
    const { status } = req.body;
    try {
        const lift = await Lift.findById(req.params.id);
        if (!lift) {
            return res.status(404).json({ message: 'Lift not found' });
        }
        if(req.userRole !== 'admin' && req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        const updatedLift = await Lift.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({message:'Lift status updated successfully',updatedLift});
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
})


router.delete('/:id',authenticateToken, async (req, res) => {
    try {
        const lift = await Lift.findById(req.params.id);
        if (!lift) {
            return res.status(404).json({ message: 'Lift not found' });
        }
        if(req.userRole !== 'admin' && req.userRole !== 'employee'){
            res.status(403).json({ message: 'Unauthorized' });
        }
        await Lift.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lift deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;