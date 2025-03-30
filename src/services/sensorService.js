// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Инициализация датчика DHT11 на пине 4
    const initialized = sensor.initialize(11, 4);
    console.log('[DEBUG] Инициализация датчика (node-dht-sensor):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor'));
    }
    // Задержка в 2000 мс для стабилизации датчика (можно увеличить, если нужно)
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
