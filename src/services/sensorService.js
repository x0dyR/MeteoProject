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
        // Выводим в консоль исходные данные для проверки
        console.log(`Сырые данные: температура = ${temperature}, влажность = ${humidity}`);

        // Если значения кажутся перепутанными, можно поменять их местами:
        // const data = new SensorData(
        //   humidity.toFixed(1), // предполагаемая температура
        //   temperature.toFixed(1) // предполагаемая влажность
        // );

        // Если всё верно, оставляем порядок таким:
        const data = new SensorData(
          temperature.toFixed(1),
          humidity.toFixed(1)
        );
        resolve(data);
      });
    }, 3000);
  });
};
