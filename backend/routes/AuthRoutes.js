const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const SECRET_KEY = 'secretKey';
const User = require('../models/user');
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/middleware');

//get all users (for testing purposes)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//ดูโปรไฟล์ผู้ใช้ของตนเอง(ต้องloginก่อน )
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

//แก้ไขโปรไฟล์ผู้ใช้ของตนเอง(ต้องloginก่อน ) เปลี่ยนรหัสผ่านได้ ถ้ารหัสผ่านซ้ำเปลี่ยนไม่ได้
router.put('/profile', authenticateToken, async (req, res) => {
    const { fullName, phone, region, password } = req.body;

    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.phone = phone || user.phone;
        user.region = region || user.region;

        if (password) {
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                return res.status(400).json({ message: 'New password must be different from the old password' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post('/register', async (req, res) => {
    const { fullName, email, password, phone, role, region } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            role,
            region
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;