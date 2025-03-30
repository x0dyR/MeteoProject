// src/services/sensorService.js
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Для DHT11 указываем тип 11; если у вас другой датчик, измените параметр.
    sensor.read(11, 4, (err, temperature, humidity) => {
      if (err) {
        return reject(new Error('failed to read sensor: ' + err));
      }
      resolve({
        temperature: temperature,
        humidity: humidity
      });
    });
  });
};
