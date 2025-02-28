const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const { loginUser, createUser, getUsers } = require('../controllers/authController');
const { confirmLogin } = require('../controllers/confirmController');
const { forgotPassword, verifyCodePassword, resetPassword } = require('../controllers/passwordController');
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser);
router.get('/users', authenticateToken, getUsers); // Protege la ruta de obtener usuarios
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Ruta protegida. Usuario: ${req.user.documento}` });
});

router.get('/confirm', confirmLogin); // Nueva ruta para confirmar el inicio de sesión

router.post('/forgot-password', forgotPassword);
router.post('/verify-code-forgot-password', verifyCodePassword);
router.post('/reset-password', resetPassword);

router.post('/send-verification-code', sendVerificationCode);
router.post('/verify-code', verifyCode);

router.get('/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;