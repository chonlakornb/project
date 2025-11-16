// models/Report.js  (รายงานการติดตั้งหรือบำรุงรักษา)
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportType: { 
    type: String, 
    enum: ['installation', 'maintenance', 'repair'], 
    required: true 
  },
  content: { type: String, required: true }, // เนื้อหารายงาน
  status: { 
    type: String, 
    enum: ['in_progress', 'completed'], 
    default: 'in_progress' 
  },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminReviewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
