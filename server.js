const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log('Error conectando a MongoDB', err));

// Rutas
app.use('/auth/user', userRoutes);

// Rutas iniciales
app.get('/', (req, res) => {
  res.send('API corriendo');
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
