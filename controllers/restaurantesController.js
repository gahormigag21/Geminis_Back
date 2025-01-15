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

module.exports = { getNITs };
