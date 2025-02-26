const express = require('express');
const router = express.Router();
const { crearPreferencia, feedback } = require('../controllers/pagosController');

// Ruta para crear preferencia de pago
router.post('/crear-preferencia', crearPreferencia);

// Ruta para manejar feedback de pago
router.get('/feedback', feedback);

module.exports = router;
