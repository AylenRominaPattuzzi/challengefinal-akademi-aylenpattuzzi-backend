require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const HttpError = require('./src/utils/http-error');
const userRoutes = require('./src/routes/userRoutes');
const coursesRutes = require('./src/routes/coursesRutes');
const enrollmentsRoutes = require('./src/routes/enrollmentsRoutes');
const gradeRoutes = require('./src/routes/gradeRutes');
const authRoutes = require('./src/routes/authRoutes');
const statsRoutes = require('./src/routes/statsRoutes');


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log('Error conectando a MongoDB', err));


app.use('/user', userRoutes);
app.use('/auth', authRoutes)
app.use('/courses', coursesRutes);
app.use('/enrollments', enrollmentsRoutes);
app.use('/grades', gradeRoutes);
app.use('/stats', statsRoutes);


app.use((req, res, next) => {
  const error = new HttpError('Ruta no encontrada', 404);
  next(error);
});

app.use((error, res, next) => {
  if (res.headersSent) {
    return next(HttpError(error, error?.code || 500));
  }
  res.status(error.code || 500).json({ error: error.message || 'Ocurrió un error desconocido' });
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
