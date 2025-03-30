// src/services/sensorService.js
const sensor = require('node-dht-sensor-rp5');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Инициализация датчика DHT11 на пине 4 с использованием libgpiod
    const initialized = sensor.initialize(11, 4);
    console.log('Инициализация датчика (node-dht-sensor-rp5 с libgpiod):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor using node-dht-sensor-rp5 with libgpiod'));
    }
    // Задержка в 2000 мс для стабилизации датчика – можно попробовать увеличить до 3000–4000 мс
    setTimeout(() => {
      sensor.read(11, 4, (err, temperature, humidity, isValid, errors) => {
        if (err) {
          console.error('Ошибка чтения датчика:', err);
          return reject(new Error('failed to read sensor: ' + err));
        }
        console.log('Данные с датчика:', { temperature, humidity, isValid, errors });
        // Проверяем, что данные валидны: isValid должно быть true, а температура и влажность не равны 0
        if (!isValid || temperature === 0 || humidity === 0) {
          return reject(new Error('invalid sensor data: temp or humidity is undefined'));
        }
        resolve({ temperature, humidity });
      });
    }, 5000);
  });
};
