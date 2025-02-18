require('dotenv').config(); // Cargar variables de entorno

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const restaurantesRoutes = require('./routes/restaurantes');
const userRoutes = require('./routes/userRoutes');
const domicilioRoutes = require('./routes/domicilio');
const sedesRoutes = require('./routes/sedes');
const menuRoutes = require('./routes/menu');
const reservasRoutes = require('./routes/reservas');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

app.use(cors());
// Aumentar el límite de tamaño de carga de archivos
app.use(bodyParser.json({ limit: '100mb' })); // Increase the limit to 100mb
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // Increase the limit to 100mb

// Rutas sin autenticación para pruebas
app.use('/api/auth', authRoutes);

app.use('/api/domicilio', domicilioRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sedes', sedesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservas', reservasRoutes);
app.get('/',  (req, res) => {
    res.send('Usuario autenticado correctamente');
});

// app.get('/', authenticateToken, (req, res) => {
//     res.send('Usuario autenticado correctamente');
// });



//Rutas con autenticación
// app.use('/api/domicilio', authenticateToken, domicilioRoutes);
// app.use('/api/restaurantes', authenticateToken, restaurantesRoutes);
// app.use('/api/users', authenticateToken, userRoutes);
// app.use('/api/sedes', authenticateToken, sedesRoutes);



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
