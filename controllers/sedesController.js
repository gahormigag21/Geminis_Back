const pool = require('../config/db');

// Get all sedes by empresa NIT
const getSedesByEmpresa = async (req, res) => {
    const { empresa } = req.query;
    try {
        const [rows] = await pool.query('SELECT * FROM Sedes WHERE Empresa = ?', [empresa]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las sedes' });
    }
};

// Get a specific sede by ID
const getSedeById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Sedes WHERE Rowid = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Sede no encontrada' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener la sede' });
    }
};

// Get all sedes
const getAllSedes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Sedes.*, Empresas.Nombre AS EmpresaNombre, Empresas.Logo AS EmpresaLogo, Empresas.UbicacionLogo, Empresas.Descripcion AS EmpresaDescripcion, Empresas.Categoria AS EmpresaCategoria
            FROM Sedes
            JOIN Empresas ON Sedes.Empresa = Empresas.NIT
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener las sedes' });
    }
};

// Create a new sede
const createSede = async (req, res) => {
    const { Direccion, Empresa, MesasTotales, MesasDisponibles, ReservasMaximas, Telefono, Imagenes, Horario } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Sedes (Direccion, Empresa, MesasTotales, MesasDisponibles, ReservasMaximas, Telefono, Horario, Imagenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [Direccion, Empresa, MesasTotales, MesasDisponibles, ReservasMaximas, Telefono, Horario, Imagenes || null]
        );
        res.status(201).json({ message: 'Sede creada exitosamente', sedeId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al crear la sede' });
    }
};

// Update a specific sede by ID
const updateSede = async (req, res) => {
    const { id } = req.params;
    const { Direccion, Empresa, MesasTotales, MesasDisponibles, ReservasMaximas, Telefono, Imagenes, Horario } = req.body;
    try {
        let query = 'UPDATE Sedes SET Direccion = ?, Empresa = ?, MesasTotales = ?, MesasDisponibles = ?, ReservasMaximas = ?, Telefono = ?, Horario = ?';
        const params = [Direccion, Empresa, MesasTotales, MesasDisponibles, ReservasMaximas, Telefono, Horario, id];

        if (Imagenes) {
            query += ', Imagenes = ?';
            params.splice(7, 0, Imagenes); // Insert Imagenes at the correct position
        }

        query += ' WHERE Rowid = ?';

        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sede no encontrada' });
        }
        res.status(200).json({ message: 'Sede actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar la sede' });
    }
};

module.exports = {
    getSedesByEmpresa,
    getSedeById,
    createSede,
    getAllSedes,
    updateSede
};
