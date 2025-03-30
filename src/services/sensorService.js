// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Явная инициализация датчика (тип 11 для DHT11, пин 4)
    const initialized = sensor.initialize(11, 4);
    console.log('Инициализация датчика:', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor'));
    }
    // Задержка 2 секунды для стабилизации датчика
    setTimeout(() => {
      sensor.read(11, 4, (err, temperature, humidity) => {
        if (err) {
          console.error('Ошибка чтения датчика:', err);
          return reject(new Error('failed to read sensor: ' + err));
        }
        console.log('Данные с датчика:', { temperature, humidity });
        resolve({ temperature, humidity });
      });
    }, 2000);
  });
};
