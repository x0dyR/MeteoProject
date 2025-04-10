const arduinoReader = require('./arduinoReader');

async function readSensorData() {
  return new Promise((resolve, reject) => {
    const data = arduinoReader.getLatestData();
    if (!data) {
      return reject(new Error('Данные с Arduino ещё не получены'));
    }
    if (
      !data.dht11 ||
      typeof data.dht11.temperature !== 'number' ||
      typeof data.dht11.humidity !== 'number'
    ) {
      return reject(new Error('Неверная структура данных от Arduino: отсутствуют dht11 или поля не заданы'));
    }
    console.log('[DEBUG] Данные с Arduino для sensor:', data.dht11);
    resolve({
      temperature: data.dht11.temperature,
      humidity: data.dht11.humidity,
      mq9: data.mq9,
      mq135: data.mq135
    });
  });
}

async function getValidSensorData(maxAttempts = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[DEBUG] Попытка считывания данных с Arduino (попытка ${attempt} из ${maxAttempts})`);
      const sensorData = await readSensorData();
      if (typeof sensorData.temperature === 'number' && typeof sensorData.humidity === 'number') {
        return sensorData;
      }
    } catch (error) {
      console.error(`[DEBUG] Попытка ${attempt} завершилась неудачей: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  throw new Error('Не удалось получить валидные данные с Arduino после нескольких попыток');
}

module.exports = {
  readSensorData,
  getValidSensorData
};
