const { sendCode, verifyUserCode } = require('../services/verificationService');

const sendVerificationCode = async (req, res, next) => {
    try {
        const { correo } = req.body;
        await sendCode(correo);
        res.status(200).json({ message: 'Código de verificación enviado' });
    } catch (error) {
        next(error);
    }
};

const verifyCode = async (req, res, next) => {
    try {
        const { correo, code } = req.body;
        const isValid = await verifyUserCode(correo, code);
        if (isValid) {
            res.status(200).json({ message: 'Código verificado correctamente' });
        } else {
            res.status(400).json({ message: 'Código de verificación incorrecto' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendVerificationCode,
    verifyCode,
};
