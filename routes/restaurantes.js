const express = require('express');
const router = express.Router();
const { getNITs } = require('../controllers/restaurantesController');

// Ruta para obtener los NITs de restaurantes
router.get('/nits', getNITs);

module.exports = router;