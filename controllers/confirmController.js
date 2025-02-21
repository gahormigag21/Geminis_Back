const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');

const confirmLogin = async (req, res, next) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generate a new token for the user
        const newToken = jwt.sign({ id: user.Documento, role: user.Administrador }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Redirect the user to the home page with the new token
        res.redirect(`http://localhost:5500/pages/confirm.html?token=${newToken}`);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El enlace de confirmación ha expirado. Por favor, vuelva a iniciar sesión.' });
        }
        next(error);
    }
};

module.exports = {
    confirmLogin,
};
