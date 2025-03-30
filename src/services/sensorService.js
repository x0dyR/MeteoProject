// src/services/sensorService.js
const sensor = require('node-dht-sensor-rp5');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Инициализируем датчик DHT11, подключённый к GPIO4
    const initialized = sensor.initialize(11, 4);
    console.log('Инициализация датчика (node-dht-sensor-rp5):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor using node-dht-sensor-rp5'));
    }
    // Задержка для стабилизации датчика (2 секунды)
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
