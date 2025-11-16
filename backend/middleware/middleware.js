//authenticate token middleware
const jwt = require('jsonwebtoken');
const user = require('../models/user');

//ใช้ bearer token ในการ authenticate

const SECRET_KEY = 'secretKey';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json({ message: 'Access Token Required' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid Access Token' });
        req.user = user; // เพิ่มข้อมูลผู้ใช้ใน request object
        req.userId = user.id;
        req.userRole = user.role;
        next();
    });
    console.log('result',user)
}

module.exports = authenticateToken;