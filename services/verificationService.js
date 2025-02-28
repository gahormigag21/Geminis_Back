const nodemailer = require('nodemailer');
const verificationCodes = new Map();

const sendCode = async (correo) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(correo, code);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: correo,
        subject: 'Código de verificación',
        text: `Su código de verificación es: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyUserCode = async (correo, code) => {
    const storedCode = verificationCodes.get(correo);
    if (storedCode === code) {
        verificationCodes.delete(correo);
        return true;
    }
    return false;
};

module.exports = {
    sendCode,
    verifyUserCode,
};
