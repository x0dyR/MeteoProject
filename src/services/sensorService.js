// src/services/sensorService.js
const sensor = require('node-dht-sensor-rp5');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    const type = 11; // DHT11, если DHT22 — поставь 22
    const pin = 4;   // GPIO номер (не физический пин!)

    const initialized = sensor.initialize(type, pin);
    console.log('Инициализация датчика (node-dht-sensor-rp5):', initialized);
    if (!initialized) {
      return reject(new Error('failed to initialize sensor using node-dht-sensor-rp5'));
    }

    setTimeout(() => {
      try {
        const result = sensor.read(type, pin);
        console.log('Данные с датчика:', result);
        if (result.temperature && result.humidity) {
          resolve({
            temperature: parseFloat(result.temperature.toFixed(1)),
            humidity: parseFloat(result.humidity.toFixed(1)),
          });
        } else {
          reject(new Error('invalid sensor data: temp or humidity is undefined'));
        }
      } catch (err) {
        console.error('Ошибка чтения датчика:', err);
        reject(new Error('failed to read sensor: ' + err));
      }
    }, 2000); // задержка 2 секунды
  });
};
