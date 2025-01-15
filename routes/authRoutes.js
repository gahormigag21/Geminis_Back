const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');

const { loginUser, createUser, getUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser);
router.get('/users', getUsers);
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Ruta protegida. Usuario: ${req.user.documento}` });
});

module.exports = router;