const express = require('express');
const router = express.Router();
const { getSedesByEmpresa, getSedeById, createSede, getAllSedes, updateSede, getDetailedSedeById, increaseMesasDisponibles, decreaseMesasDisponibles } = require('../controllers/sedesController');

// Endpoint to get all sedes
router.get('/all', getAllSedes);

// Endpoint to get all sedes by empresa NIT
router.get('/', getSedesByEmpresa);

// Endpoint to get a specific sede by ID
router.get('/:id', getSedeById);

// Endpoint to create a new sede
router.post('/', createSede);

// Endpoint to increase the number of available tables by 1
router.put('/:id/increaseMesas', increaseMesasDisponibles);

// Endpoint to decrease the number of available tables by 1
router.put('/:id/decreaseMesas', decreaseMesasDisponibles);

// Endpoint to update a specific sede by ID
router.put('/:id', updateSede);

// Endpoint to get detailed information of a specific sede by Rowid
router.get('/all/sedeid/:id', getDetailedSedeById);



module.exports = router;
