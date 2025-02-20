const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');

const confirmLogin = async (req, res, next) => {
    try {
        const { email } = req.query;
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.Documento, role: user.Administrador }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Redirigir al usuario a la página de inicio con el token
        res.redirect(`http://localhost:5500/pages/home.html?token=${token}`);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    confirmLogin,
};
