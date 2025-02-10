const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');

// POST: Create a new reservation
router.post('/', reservasController.createReservation);

// GET: Get reservations by user
router.get('/usuario/:usuarioId', reservasController.getReservationsByUser);

// GET: Get reservations by sede
router.get('/sede/:sedeId', reservasController.getReservationsBySede);

// PUT: Cancel a reservation by ID
router.put('/cancelar/:reservationId', reservasController.cancelReservation);

module.exports = router;
