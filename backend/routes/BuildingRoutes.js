const express = require('express');
const router = express.Router();
const Building = require('../models/building');
const Elevator = require('../models/lift');

const authenticateToken = require('../middleware/middleware');
const user = require('../models/user');

//get all building by user id
router.get('/',authenticateToken, async (req, res) => {
    try {
        const buildings = await Building.find({ owner: req.userId }).populate('elevator');
        res.json(buildings);

        if (buildings.length === 0) {
            return res.status(404).json({ message: 'Buildings not found or not created' });
        }

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
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
        if(req.userRole !== 'admin' || user.id !== building.owner){
            res.status(403).json({ message: 'Unauthorized' });
        }
        await Building.findByIdAndDelete(req.params.id);
        res.json({ message: 'Building deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post('/', authenticateToken, async (req, res) => {
    const userId = req.userId;

    const { name, address, region, type, floor  } = req.body;

    try {
        const newBuilding = new Building({
            name,
            type,
            floor,
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


router.post('/:id/elevator', authenticateToken, async (req, res) => {
  const { elevator, elevators } = req.body;
  try {
    const building = await Building.findById(req.params.id);
    if (!building) return res.status(404).json({ message: 'Building not found' });

    // Normalize legacy scalar elevator -> array
    if (!Array.isArray(building.elevator)) {
      building.elevator = building.elevator ? [building.elevator] : [];
    }

    if (req.userRole !== 'admin' && req.userId !== building.owner.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const ids = elevator ? [elevator] : (Array.isArray(elevators) ? elevators : null);
    if (!ids) return res.status(400).json({ message: 'Provide "elevator" or "elevators" in body' });

    const lifts = await Elevator.find({ _id: { $in: ids } });
    if (lifts.length !== ids.length) return res.status(404).json({ message: 'One or more lifts not found' });

    for (const l of lifts) {
      if (l.building.toString() !== building._id.toString()) {
        return res.status(400).json({ message: `Lift ${l._id} is not assigned to this building` });
      }
      if (!building.elevator.map(String).includes(String(l._id))) building.elevator.push(l._id);
    }

    await building.save();
    await building.populate('elevator');
    res.json({ message: 'Elevator(s) added', building });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//ตั้งค่าใน mongoDB shell เก็บ lift ไว้ใน building เป็น array 
//db.buildings.find().forEach(function(doc){
// if (doc.elevator && !Array.isArray(doc.elevator)) {
//  db.buildings.updateOne({_id: doc._id}, {$set: { elevator: [doc.elevator] }});
// } else if (!doc.elevator) {
//  db.buildings.updateOne({_id: doc._id}, {$set: { elevator: [] }});
// }
// });

module.exports = router;