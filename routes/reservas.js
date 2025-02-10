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

// PUT: Confirm a reservation by ID
router.put('/confirmar/:reservationId', reservasController.confirmReservation);

// PUT: Complete a reservation by ID
router.put('/completar/:reservationId', reservasController.completeReservation);

// PUT: Mark a reservation as no-show by ID
router.put('/noshow/:reservationId', reservasController.noShowReservation);

module.exports = router;
