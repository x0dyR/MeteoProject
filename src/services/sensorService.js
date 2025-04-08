// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      sensor.read(11, 4, (err, temperature, humidity) => {
        if (err) {
          console.error('[DEBUG] Ошибка чтения датчика:', err);
          return reject(new Error('failed to read sensor: ' + err));
        }
        console.log('[DEBUG] Данные с датчика:', { temperature, humidity });
        // Здесь можно добавить дополнительные проверки (например, если значения равны 0)
        if (temperature === 0 || humidity === 0) {
          return reject(new Error('invalid sensor data: temperature or humidity is 0'));
        }
        resolve({ temperature, humidity });
      });
    }, 2000);
  });
};
