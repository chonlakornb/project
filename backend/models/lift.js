const mongoose = require('mongoose');

const liftSchema = new mongoose.Schema({
  name: { type: String },
  model: { type: String },
  capacity: { type: Number },
  floorsServed: [{ type: Number }],
  status: { type: String, enum: ['pending','in_progress','operational', 'maintenance', 'out_of_service'], default: 'pending' },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  installedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lift', liftSchema);