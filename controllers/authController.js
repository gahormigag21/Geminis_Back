const pool = require('../config/db');
const { login, registerUser, listUsers } = require('../services/authService');

const createUser = async (req, res, next) => {
    try {
        const {
            tipo,
            documento,
            nombres,
            apellido,
            telefono,
            direccion,
            contrasena,
            penalizacion,
            estado,
            administrador,
            nitRestaurante,
            nit,
            nombre,
            logo,
            ubicacionLogo,
        } = req.body;

        if (tipo === 'usuario') {
            const user = {
                documento,
                nombres,
                apellido,
                telefono,
                direccion,
                contrasena,
                penalizacion: penalizacion || 0,
                estado: estado || 1,
                administrador: administrador || 0,
                empresa: nitRestaurante || null,
            };

            const userId = await registerUser(user);
            return res.status(201).json({ message: 'Usuario creado exitosamente', userId });

        } else if (tipo === 'restaurante') {
            if (!nit || !nombre) {
                return res.status(400).json({ message: 'NIT y Nombre son obligatorios para crear un restaurante' });
            }

            const queryEmpresa = `
                INSERT INTO Empresas (NIT, Nombre, Logo, UbicacionLogo) 
                VALUES (?, ?, ?, ?)`;
            const values = [nit, nombre, null, ubicacionLogo || null];

            await pool.query(queryEmpresa, values);
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
        const { documento, contrasena } = req.body;
        const { token, user } = await login(documento, contrasena);

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
        res.status(401).json({ error: error.message });
    }
};

module.exports = {
    loginUser,
    createUser,
    getUsers,
};
