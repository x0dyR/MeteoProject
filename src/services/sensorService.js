// src/services/sensorService.js
const sensor = require('node-dht-sensor-rp5');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Инициализация датчика DHT11 на пине 4 с использованием libgpiod
    const initialized = sensor.initialize(11, 4);
    console.log('[DEBUG] Инициализация датчика (node-dht-sensor-rp5):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor using node-dht-sensor-rp5'));
    }
    
    // Задержка 3000 мс для стабилизации датчика (можно попробовать увеличить)
    setTimeout(() => {
      sensor.read(11, 4, (err, temperature, humidity, isValid, errors) => {
        if (err) {
          console.error('[DEBUG] Ошибка чтения датчика:', err);
          return reject(new Error('failed to read sensor: ' + err));
        }
        console.log('[DEBUG] Данные, полученные с датчика:', { temperature, humidity, isValid, errors });
        
        if (!isValid) {
          console.error('[DEBUG] Данные невалидны. Ошибок:', errors);
          return reject(new Error('invalid sensor data: isValid is false, errors: ' + errors));
        }
        if (temperature === 0 || humidity === 0) {
          console.error('[DEBUG] Получены нулевые значения:', { temperature, humidity });
          return reject(new Error('invalid sensor data: temperature or humidity is 0'));
        }
        resolve({ temperature, humidity });
      });
    }, 3000);
  });
};
