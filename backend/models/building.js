// models/Building.js
const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // ประเภทอาคาร เช่น โรงแรม, คอนโด, โรงพยาบาล
  address: { type: String, required: true },
  region: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  installationStatus: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed'], 
    default: 'pending'
  },
  maintenanceStatus: { 
    type: String, 
    enum: ['normal', 'in_maintenance', 'need_repair'], 
    default: 'normal'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Building', buildingSchema);
