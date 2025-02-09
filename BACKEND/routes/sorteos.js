const express = require('express');
const router = express.Router();
const Sorteo = require('../models/Sorteo');

// Crear un sorteo
router.post('/', async (req, res) => {
    try {
        const nuevoSorteo = new Sorteo(req.body);
        const sorteoGuardado = await nuevoSorteo.save();
        res.status(201).json(sorteoGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el sorteo', error });
    }
});

// Obtener todos los sorteos
router.get('/', async (req, res) => {
    try {
        const sorteos = await Sorteo.find();
        res.status(200).json(sorteos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los sorteos', error });
    }
});

// Actualizar información del sorteo
router.put('/:id', async (req, res) => {
    try {
        const sorteoActualizado = await Sorteo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(sorteoActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el sorteo', error });
    }
});

module.exports = router;
