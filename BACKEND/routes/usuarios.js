const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Crear un usuario
router.post('/', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().populate('boletos');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
});

// Obtener un usuario por su teléfono
router.get('/:telefono', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ telefono: req.params.telefono }).populate('boletos');
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});

module.exports = router;
