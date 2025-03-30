require('dotenv').config(); // Загружаем переменные окружения из .env

const express = require('express');
const mongoose = require('mongoose');
const sensorRoute = require('./routes/sensorRoute');

const app = express();
const port = 3000;

// Подключаемся к MongoDB используя переменную окружения
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/sensors', sensorRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
