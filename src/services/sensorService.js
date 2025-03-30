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
    // Задержка 2 секунды для стабилизации датчика
    setTimeout(() => {
      // Функция read возвращает значения через callback
      // Обратите внимание, что в node-dht-sensor-rp5 callback может возвращать дополнительные параметры:
      // (err, temperature, humidity, isValid, errors)
      sensor.read(11, 4, (err, temperature, humidity, isValid, errors) => {
        if (err) {
          console.error('Ошибка чтения датчика:', err);
          return reject(new Error('failed to read sensor: ' + err));
        }
        console.log('Данные с датчика:', { temperature, humidity, isValid, errors });
        // Если данные невалидны или равны 0 (что может указывать на ошибку)
        if (!isValid || temperature === 0 || humidity === 0) {
          return reject(new Error('invalid sensor data: temp or humidity is undefined'));
        }
        resolve({ temperature, humidity });
      });
    }, 5000);
  });
};
