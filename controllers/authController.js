const pool = require('../config/db');
const { login, registerUser, registerRestaurant, listUsers, sendConfirmationEmail } = require('../services/authService');

const createUser = async (req, res, next) => {
    try {
        const {
            tipo,
            documento,
            nombres,
            apellido,
            correo,
            telefono,
            direccion,
            contrasena,
            penalizacion,
            estado,
            administrador,
            nitRestaurante,
            nit,
            nombre,
            UbicacionLogo,
            descripcion,
            categoria
        } = req.body;

        if (tipo === 'usuario') {
            const user = {
                documento,
                nombres,
                apellido,
                correo,
                telefono,
                direccion,
                contrasena,
                penalizacion: penalizacion || 0,
                estado: estado || 1,
                administrador: administrador || 0,
                empresa: nitRestaurante || null,
                autenticacionDosFactores: 0 // Nuevo campo autenticacionDosFactores con valor por defecto 0
            };

            const userId = await registerUser(user);
            return res.status(201).json({ message: 'Usuario creado exitosamente', userId });

        } else if (tipo === 'restaurante') {
            const restaurant = { nit, nombre, UbicacionLogo, descripcion, categoria };
            await registerRestaurant(restaurant);
            return res.status(201).json({ message: 'Restaurante creado exitosamente' });
        }

        return res.status(400).json({ message: 'Tipo inválido. Debe ser "usuario" o "restaurante".' });

    } catch (error) {
        next(error); // Usa el middleware de manejo de errores
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await listUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error); // Usa el middleware de manejo de errores
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { correo, contrasena } = req.body;
        const { token, user } = await login(correo, contrasena);

        if (user.AutenticacionDosFactores && !user.confirmationEmailSent) {
            await sendConfirmationEmail(correo);
            user.confirmationEmailSent = true;
            return res.status(200).json({
                message: 'Correo de confirmación enviado',
                user: {
                    Documento: user.Documento,
                    Nombres: user.Nombres,
                    Apellido: user.Apellido,
                    Administrador: user.Administrador,
                    Empresa: user.Empresa,
                    AutenticacionDosFactores: user.AutenticacionDosFactores,
                },
            });
        }

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                Documento: user.Documento,
                Nombres: user.Nombres,
                Apellido: user.Apellido,
                Administrador: user.Administrador,
                Empresa: user.Empresa,
            },
        });
    } catch (error) {
        console.error('Error en loginUser:', error.message); // Agregar detalles de depuración
        res.status(401).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    createUser,
    getUsers,
};
