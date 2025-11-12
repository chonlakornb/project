//authenticate token middleware
const jwt = require('jsonwebtoken');

//ใช้ bearer token ในการ authenticate

const SECRET_KEY = 'secretKey';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        req.userId = user.id;
        next();
    });
}

module.exports = authenticateToken;