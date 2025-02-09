const express = require('express');
const router = express.Router();
const Boleto = require('../models/Boleto');


// Crear un boleto
router.post('/', async (req, res) => {
    try {
        const { nombre, apellidos, telefono, estado, numeros } = req.body;
        const folio = `FOLIO-${Date.now()}`; // Generar folio único
        const nuevoBoleto = new Boleto({ nombre, apellidos, telefono, estado, numeros, folio });
        const boletoGuardado = await nuevoBoleto.save();
        res.status(201).json(boletoGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el boleto', error });
    }
});

// Obtener todos los boletos
router.get('/', async (req, res) => {
    try {
        const boletos = await Boleto.find();
        res.status(200).json(boletos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los boletos', error });
    }
});

// Actualizar estatus de un boleto
router.put('/:id', async (req, res) => {
    try {
        const boletoActualizado = await Boleto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(boletoActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el boleto', error });
    }
});

// Eliminar un boleto
router.delete('/:id', async (req, res) => {
    try {
        await Boleto.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Boleto eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el boleto', error });
    }
});

module.exports = router;
