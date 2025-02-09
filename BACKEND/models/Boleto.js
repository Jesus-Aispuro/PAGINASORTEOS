const mongoose = require('mongoose');

const BoletoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true },
    estado: { type: String, required: true },
    numeros: { type: [Number], required: true }, // Array de números seleccionados
    estatus: { type: String, enum: ['apartado', 'pagado', 'disponible'], default: 'apartado' },
    folio: { type: String, unique: true, required: true },
    creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Boleto', BoletoSchema);
