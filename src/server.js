const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const sensorController = require('./controllers/sensorController');
const adviceService = require('./services/adviceService');
const arduinoReader = require('./services/arduinoReader');

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

// Маршрут для страницы настройки комфорта
app.get('/comfort', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'comfort.html'));
});

// Новый API‑эндпоинт для управления вентилятором
app.post('/setFan', async (req, res) => {
  const { status } = req.body; // ожидается "on" или "off"
  if (!status || (status !== 'on' && status !== 'off')) {
    return res.status(400).json({ message: 'Неверный статус. Ожидается "on" или "off".' });
  }
  const command = status === 'on' ? 'FAN_ON' : 'FAN_OFF';
  try {
    await arduinoReader.sendCommand(command);
    res.json({ message: `Команда ${command} отправлена успешно` });
  } catch (err) {
    console.error('Ошибка отправки команды вентилятору:', err);
    res.status(500).json({ message: 'Ошибка отправки команды: ' + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
