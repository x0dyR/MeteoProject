const SensorData = require('../model/sensorData');
const sensor = require('node-dht-sensor');

exports.readSensorData = async () => {
  return new Promise((resolve, reject) => {
    // sensor.read(тип датчика, номер пина, callback)
    sensor.read(22, 4, (err, temperature, humidity) => {
      if (err) {
        return reject(err);
      }
      // Округляем значения до одного знака после запятой
      const data = new SensorData(temperature.toFixed(1), humidity.toFixed(1));
      resolve(data);
    });
  });
};
