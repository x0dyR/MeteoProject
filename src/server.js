require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Подключаем статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Если нужно, можно добавить API, например, для получения данных с датчика
// app.get('/sensors', async (req, res) => {
//   // Логика получения данных...
//   res.json({ message: 'Sensor data' });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
