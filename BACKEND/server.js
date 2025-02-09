const express = require('express'); // Framework para crear el servidor y manejar rutas
const mongoose = require('mongoose'); // Librería para interactuar con MongoDB
const boletosRoutes = require('../BACKEND/routes/boletos'); // Rutas para boletos
const usuariosRoutes = require('../BACKEND/routes/usuarios'); // Rutas para usuarios
const sorteosRoutes = require('../BACKEND/routes/sorteos'); // Rutas para sorteos

const app = express(); // Crear una aplicación de Express
app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// Ruta básica para probar si el servidor está corriendo
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Conectar rutas
app.use('/api/boletos', boletosRoutes); // Rutas para boletos
app.use('/api/usuarios', usuariosRoutes); // Rutas para usuarios
app.use('/api/sorteos', sorteosRoutes); // Rutas para sorteos

const PORT = 4000; // Puerto donde correrá el servidor

// Conexión a MongoDB
mongoose.connect('mongodb+srv://jesusaispurog:Churi370@cluster0.m46ze.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error al conectar con MongoDB:', error));

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
