// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestType: { 
    type: String, 
    enum: ['installation', 'maintenance', 'repair', 'complaint'], 
    required: true 
  },
  title: { type: String, required: true }, // หัวข้อคำขอ เช่น "ลิฟต์ไม่ทำงาน", "ขอติดตั้งใหม่"
  description: { type: String, required: true }, // รายละเอียดเพิ่มเติม
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'rejected'], 
    default: 'pending' 
  },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ผู้ส่งคำขอ
  assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // พนักงานที่ได้รับมอบหมาย
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // แอดมินที่ตรวจสอบ/อนุมัติ
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  }, // ความเร่งด่วนของคำขอ
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Request', requestSchema);
