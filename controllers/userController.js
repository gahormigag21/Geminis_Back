const userModel = require('../models/userModel');

// Obtener un usuario por su documento
const getUser = async (req, res) => {
    try {
        const { documento } = req.params;
        const user = await userModel.getUserByDocument(documento);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Actualizar un usuario por su documento
const updateUser = async (req, res) => {
    try {
        const { documento } = req.params;
        const userData = req.body;

        const result = await userModel.updateUserByDocument(documento, userData);

        if (result === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

module.exports = {
    getUser,
    updateUser,
};
