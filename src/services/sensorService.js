// src/services/sensorService.js
const sensor = require('node-dht-sensor-rp5');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Инициализация датчика DHT11 на пине 4
    const initialized = sensor.initialize(11, 4);
    console.log('Инициализация датчика (node-dht-sensor-rp5):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor using node-dht-sensor-rp5'));
    }
    // Задержка для стабилизации датчика, попробуйте увеличить, если требуется
    setTimeout(() => {
      try {
        const data = sensor.readSync(11, 4);
        console.log('Данные с датчика:', data);
        // Проверяем, что данные валидны
        if (!data.isValid || data.temperature === 0 || data.humidity === 0) {
          return reject(new Error('invalid sensor data: temp or humidity is undefined or zero'));
        }
        resolve({ temperature: data.temperature, humidity: data.humidity });
      } catch (err) {
        console.error('Ошибка чтения датчика (readSync):', err);
        reject(new Error('failed to read sensor: ' + err));
      }
    }, 2000);
  });
};
