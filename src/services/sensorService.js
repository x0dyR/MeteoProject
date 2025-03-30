// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Явная инициализация датчика
    if (!sensor.initialize(11, 4)) {
      return reject(new Error('failed to initialize sensor'));
    }
    sensor.read(11, 16, (err, temperature, humidity) => {
      if (err) {
        console.error('Ошибка чтения датчика:', err);
        return reject(new Error('failed to read sensor: ' + err));
      }
      console.log('Данные с датчика:', { temperature, humidity });
      resolve({ temperature, humidity });
    });
  },3000);
};
