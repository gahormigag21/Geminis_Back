const jwt = require('jsonwebtoken');
const { getUserByEmail, updateUserByDocument } = require('../models/userModel');
const nodemailer = require('nodemailer');

// Temporary storage for verification codes (in-memory)
const verificationCodes = {};

const forgotPassword = async (req, res, next) => {
    try {
        const { correo } = req.body;
        const user = await getUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generar código de 6 dígitos
        verificationCodes[correo] = code; // Store the code in memory

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Código de restablecimiento de contraseña',
            text: `Su código de restablecimiento de contraseña es: ${code}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Código de restablecimiento enviado' });
    } catch (error) {
        next(error);
    }
};

const verifyCodePassword = async (req, res, next) => {
    try {
        const { code } = req.body;

        const correo = Object.keys(verificationCodes).find(email => verificationCodes[email] === code);

        if (!correo) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }

        // Code is correct, redirect to the new password page
        res.status(200).json({ message: 'Código verificado correctamente', redirectUrl: 'set-new-password.html' });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { correo, nuevaContrasena } = req.body;
        const user = await getUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await updateUserByDocument(user.Documento, { Contrasena: nuevaContrasena });

        res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    forgotPassword,
    verifyCodePassword,
    resetPassword,
};
