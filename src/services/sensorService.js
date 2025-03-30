// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    sensor.read(11, 4, (err, temperature, humidity) => {
      if (err) {
        console.error('Ошибка чтения датчика:', err);
        return reject(new Error('failed to read sensor: ' + err));
      }
      console.log('Данные с датчика:', { temperature, humidity });
      resolve({ temperature, humidity });
    });
  });
};
