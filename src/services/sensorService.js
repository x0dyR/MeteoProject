const SensorData = require('../model/sensorData');
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // Ждём 3 секунды
    setTimeout(() => {
      sensor.read(11, 4, (err, temperature, humidity) => {
        if (err) {
          return reject(err);
        }
        // Округляем значения до одного знака
        const data = new SensorData(
          temperature.toFixed(1),
          humidity.toFixed(1)
        );
        resolve(data);
      });
    }, 3000);
  });
};
