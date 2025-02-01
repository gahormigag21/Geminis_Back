const express = require('express');
const router = express.Router();
const { getNITs, getAllRestaurants, getRestaurantByNIT, updateRestaurantByNIT } = require('../controllers/restaurantesController');

// Ruta para obtener los NITs de restaurantes
router.get('/nits', getNITs);

// Ruta para obtener todos los restaurantes
router.get('/', getAllRestaurants);

// Ruta para obtener un restaurante por NIT
router.get('/:nit', getRestaurantByNIT);

// Ruta para actualizar un restaurante por NIT
router.put('/:nit', updateRestaurantByNIT);

module.exports = router;