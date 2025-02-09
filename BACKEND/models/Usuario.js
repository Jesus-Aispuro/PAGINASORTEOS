const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, unique: true, required: true },
    estado: { type: String, required: true },
    boletos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Boleto' }], // Relación con boletos
    creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
