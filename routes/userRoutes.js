const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener un usuario por su documento
router.get('/:documento', userController.getUser);

// Ruta para actualizar un usuario por su documento
router.put('/:documento', userController.updateUser);

module.exports = router;
