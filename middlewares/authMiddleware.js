require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getUserByDocument } = require('../models/userModel');
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await getUserByDocument(decoded.id);

        if (!user) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    } catch (error) {
        res.sendStatus(403);
    }
};

module.exports = authenticateToken;
