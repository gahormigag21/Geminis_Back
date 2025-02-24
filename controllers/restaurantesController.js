const pool = require('../config/db');
/**
 * Obtiene los NITs de todos los restaurantes registrados.
 */
const getNITs = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT NIT FROM Empresas'); // Consulta a la tabla "Empresas"
        const nits = results.map(row => row.NIT); // Extraer solo los NITs
        res.status(200).json(nits); // Responder con la lista de NITs
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener NITs de restaurantes' });
    }
};

/**
 * Obtiene todos los restaurantes registrados.
 */
const getAllRestaurants = async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM Empresas'); // Consulta a la tabla "Empresas"
        res.status(200).json(results); // Responder con la lista de restaurantes
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener todos los restaurantes' });
    }
};

/**
 * Obtiene un restaurante por NIT.
 */
const getRestaurantByNIT = async (req, res) => {
    const { nit } = req.params;
    try {
        const [results] = await pool.query('SELECT * FROM Empresas WHERE NIT = ?', [nit]); // Consulta a la tabla "Empresas"
        if (results.length === 0) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json(results[0]); // Responder con el restaurante encontrado
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el restaurante' });
    }
};

/**
 * Actualiza la información de un restaurante por NIT.
 */
const updateRestaurantByNIT = async (req, res) => {
    const { nit } = req.params;
    const { Nombre, Logo, UbicacionLogo, Descripcion, Categoria } = req.body;
    try {
        let query = `
            UPDATE Empresas 
            SET Nombre = ?, Logo = ?, Descripcion = ?, Categoria = ? 
        `;
        const values = [
            Nombre, 
            Logo ? Buffer.from(Logo, 'base64') : null, 
            Descripcion || '', 
            Categoria || '', 
            nit
        ];

        if (UbicacionLogo !== undefined && UbicacionLogo !== null) {
            query += `, UbicacionLogo = ? `;
            values.splice(4, 0, UbicacionLogo);
        }

        query += `WHERE NIT = ?`;

        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Restaurante no encontrado' });
        }
        res.status(200).json({ message: 'Restaurante actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el restaurante' });
    }
};

module.exports = { getNITs, getAllRestaurants, getRestaurantByNIT, updateRestaurantByNIT };
