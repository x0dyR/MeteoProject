// src/server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const sensorController = require('./controllers/sensorController');
const adviceService = require('./services/adviceService');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Маршрут для получения данных с датчика и рекомендаций
app.get('/sensors', sensorController.getSensorData);

// Маршрут для обновления комфортных значений
app.post('/setComfortValues', (req, res) => {
  const idealIndoorTemp = parseFloat(req.body.idealIndoorTemp);
  const idealIndoorHum = parseFloat(req.body.idealIndoorHum);
  const idealOutdoorTemp = parseFloat(req.body.idealOutdoorTemp);
  const idealOutdoorHum = parseFloat(req.body.idealOutdoorHum);
  
  if (
    !isNaN(idealIndoorTemp) &&
    !isNaN(idealIndoorHum) &&
    !isNaN(idealOutdoorTemp) &&
    !isNaN(idealOutdoorHum)
  ) {
    adviceService.updateComfortableValues({
      idealIndoorTemp,
      idealIndoorHum,
      idealOutdoorTemp,
      idealOutdoorHum
    });
    res.json({ message: 'Новые комфортные значения установлены' });
  } else {
    res.status(400).json({ message: 'Неверный формат данных' });
  }
});

// Добавляем маршрут для страницы настройки комфорта
app.get('/comfort', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'comfort.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
