// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'employee', 'admin'], 
    default: 'user' 
  },
  region: { type: String }, // ภูมิภาค เช่น เหนือ, กลาง, ใต้, ตะวันออก
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);