const mongoose = require('mongoose');

const SorteoSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // Ejemplo: "Sorteo del Auto 2024"
    descripcion: { type: String },
    fecha: { type: Date, required: true }, // Fecha del sorteo
    boletosDisponibles: { type: Number, required: true }, // Total de boletos
    boletosApartados: { type: Number, default: 0 },
    boletosPagados: { type: Number, default: 0 },
    precioBoleto: { type: Number, required: true },
    creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sorteo', SorteoSchema);
