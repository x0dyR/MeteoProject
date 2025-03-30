require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); // Подключаем mongoose

const sensorController = require('./controllers/sensorController');
const app = express();
const port = process.env.PORT || 3000;

// Подключаемся к удалённой MongoDB, используя переменную окружения MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Устанавливаем тайм-аут в 30 секунд
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Роут для API: запрос к /sensors возвращает JSON с данными
app.get('/sensors', sensorController.getSensorData);

// Отдаем статические файлы (HTML, CSS, JS) из папки public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
