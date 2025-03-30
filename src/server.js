require('dotenv').config();
const express = require('express');
const path = require('path');

// Пример контроллера, если у вас есть sensorController
// Если нет — см. "Пример без контроллера" ниже
const sensorController = require('./controllers/sensorController');

const app = express();
const port = process.env.PORT || 3000;

// 1. Создаем маршрут /sensors для отдачи JSON
app.get('/sensors', sensorController.getSensorData);

// 2. Подключаем статические файлы (HTML, CSS, JS) из папки public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
