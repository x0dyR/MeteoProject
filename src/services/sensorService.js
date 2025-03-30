// src/services/sensorService.js
const sensor = require('node-dht-sensor2');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    try {
      // Инициализация датчика: 11 для DHT11, пин 4 (проверьте, что это соответствует вашему подключению)
      const initialized = sensor.initialize(11, 4);
      console.log('Инициализация датчика (node-dht-sensor2):', initialized);
      if (!initialized) {
        return reject(new Error('failed to initialize sensor using node-dht-sensor2'));
      }
      // Небольшая задержка может помочь датчику стабилизироваться
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
    } catch (e) {
      reject(e);
    }
  });
};
