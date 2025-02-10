const pool = require('../config/db');

// Generate a random confirmation number with 2 letters followed by 2 numbers
function generateConfirmationNumber() {
    const letters = Math.random().toString(36).substr(2, 2).toUpperCase();
    const numbers = Math.floor(Math.random() * 90 + 10).toString();
    return letters + numbers;
}

exports.createReservation = async (req, res) => {
    const { Usuario, Sede, Ocasion, Fecha, Hora, Personas, Telefono } = req.body; 
    const NumeroDeConfirmacion = generateConfirmationNumber();
    const Estado = 1; 

    try {
        const [result] = await pool.query(
            'INSERT INTO Reservas (Usuario, Sede, Ocasion, Fecha, Hora, Personas, Estado, NumeroDeConfirmacion, Telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', // Added Telefono
            [Usuario, Sede, Ocasion, Fecha, Hora, Personas, Estado, NumeroDeConfirmacion, Telefono] 
        );
        res.status(201).json({ id: result.insertId, NumeroDeConfirmacion });
    } catch (error) {
        res.status(500).json({ error: 'Error creating reservation' });
    }
};

exports.getReservationsByUser = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM Reservas WHERE Usuario = ?', [usuarioId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations' });
    }
};

exports.getReservationsBySede = async (req, res) => {
    const { sedeId } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM Reservas WHERE Sede = ?', [sedeId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations' });
    }
};

exports.cancelReservation = async (req, res) => {
    const { reservationId } = req.params;
    const Estado = 3;

    try {
        const [result] = await pool.query('UPDATE Reservas SET Estado = ? WHERE Rowid = ?', [Estado, reservationId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error cancelling reservation' });
    }
};
