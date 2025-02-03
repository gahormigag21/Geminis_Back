const express = require('express');
const router = express.Router();
const { getSedesByEmpresa, getSedeById, createSede, getAllSedes, updateSede } = require('../controllers/sedesController');

// Endpoint to get all sedes by empresa NIT
router.get('/', getSedesByEmpresa);

// Endpoint to get a specific sede by ID
router.get('/:id', getSedeById);

// Endpoint to create a new sede
router.post('/', createSede);

// Endpoint to get all sedes
router.get('/all', getAllSedes);

// Endpoint to update a specific sede by ID
router.put('/:id', updateSede);

module.exports = router;
