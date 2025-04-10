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
app.post('/setComfortValues', async (req, res) => {
  const { idealIndoorTemp, idealIndoorHum, idealOutdoorTemp, idealOutdoorHum } = req.body;
  if (
    typeof idealIndoorTemp !== 'number' ||
    typeof idealIndoorHum !== 'number' ||
    typeof idealOutdoorTemp !== 'number' ||
    typeof idealOutdoorHum !== 'number'
  ) {
    return res.status(400).json({ message: 'Неверный формат данных' });
  }
  try {
    const updatedSetting = await adviceService.updateComfortableValues({
      idealIndoorTemp,
      idealIndoorHum,
      idealOutdoorTemp,
      idealOutdoorHum
    });
    res.json({ message: 'Новые комфортные значения установлены', setting: updatedSetting });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка обновления комфортных значений' });
  }
});

// Добавляем обработчик для маршрута /comfort, чтобы отдавать страницу с настройками комфорта
app.get('/comfort', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'comfort.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
