// src/services/sensorService.js
const sensor = require('node-dht-sensor');

// Альтернативный вариант, если поддерживается sensor.promises.read
exports.readSensorData = async () => {
    if (!sensor.initialize(11, 4)) {
      throw new Error('failed to initialize sensor');
    }
    try {
      const data = await sensor.promises.read(11, 4);
      console.log('Данные с датчика (promises):', data);
      return data;
    } catch (err) {
      console.error('Ошибка чтения датчика (promises):', err);
      throw new Error('failed to read sensor: ' + err);
    }
  };
  