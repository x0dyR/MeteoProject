require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cron = require('node-cron');

const sensorController = require('./controllers/sensorController');

const app = express();
const port = process.env.PORT || 3000;

// Подключаемся к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Добавляем API-роут для /sensors
app.get('/sensors', sensorController.getSensorData);

// Отдаем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Импортируем sensorService и deviceControllerService для автоматизированного контроля
const sensorService = require('./services/sensorService');
const deviceControllerService = require('./services/deviceControllerService');

// Пример задачи, которая выполняется каждый день в 8:00 утра
cron.schedule('0 8 * * *', async () => {
  try {
    // Читаем данные с датчика
    const sensorData = await sensorService.readSensorData();
    // Получаем команды для устройств
    const actions = deviceControllerService.controlDevices(sensorData);
    console.log(`[8:00 AM] Данные с датчика:`, sensorData);
    console.log(`[8:00 AM] Команды для устройств:`, actions);
    
    // Здесь вы можете добавить логику отправки команд на физические устройства
    // Например, через GPIO или API контроллера устройств.
  } catch (error) {
    console.error('Ошибка при выполнении запланированной задачи:', error);
  }
});
