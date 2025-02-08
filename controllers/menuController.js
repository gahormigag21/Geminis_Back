const pool = require('../config/db');

// Get a specific menu by ID
const getMenuById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Menus WHERE Sede = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.status(200).json(rows); // Return all rows
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener el menú' });
    }
};

// Get a specific menu by rowid
const getMenuByRowid = async (req, res) => {
    const { rowid } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM Menus WHERE Rowid = ?', [rowid]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener el menú' });
    }
};

// Get all menus
const getAllMenu = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Menus');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al obtener los menús' });
    }
};

// Create a new menu
const createMenu = async (req, res) => {
    const { Nombre, Descripcion, Precio, Tipo, Sede, Imagen } = req.body;
    const Estado = 1; // TODO: Replace with actual logic for Estado
    try {
        const [result] = await pool.query(
            'INSERT INTO Menus (Nombre, Descripcion, Precio, Tipo, Sede, ImagenMenu, Estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Nombre, Descripcion, Precio, Tipo, Sede, Imagen || null, Estado]
        );
        res.status(201).json({ message: 'Menú creado exitosamente', menuId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al crear el menú' });
    }
};

// Update a specific menu by ID
const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Descripcion, Precio, Tipo, Imagen } = req.body;
    try {
        let query = 'UPDATE Menus SET Nombre = ?, Descripcion = ?, Precio = ?, Tipo = ?';
        const params = [Nombre, Descripcion, Precio, Tipo, id];

        if (Imagen) {
            query += ', ImagenMenu = ?';
            params.splice(4, 0, Imagen); // Insert Imagen at the correct position
        }

        query += ' WHERE Rowid = ?';

        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Menú no encontrado' });
        }
        res.status(200).json({ message: 'Menú actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el menú' });
    }
};

module.exports = {
    getMenuById,
    createMenu,
    updateMenu,
    getMenuByRowid,
    getAllMenu
};
