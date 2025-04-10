// src/services/sensorService.js
const arduinoReader = require('./arduinoReader');

/**
 * Округляет значение до 4 знаков после запятой.
 * @param {number} value 
 * @returns {number} значение, округленное до 0.0001
 */
function roundTo4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * Функция расчёта концентрации для датчика MQ9.
 * Использует условные коэффициенты для расчёта концентрации различных газов.
 * Если ratio равен 0, возвращается null.
 * @param {number} ratio - сырое значение ratio с MQ9.
 * @param {string} gasType - тип газа ('LPG', 'Methane' или 'CO').
 * @returns {number|null} концентрация в ppm, округленная до 4 знаков.
 */
function calculateMQ9Concentration(ratio, gasType) {
  if (ratio === 0) return null;
  let m, b;
  switch (gasType) {
    case 'LPG':
      m = -1.1; b = 3.3;
      break;
    case 'Methane':
      m = -0.75; b = 1.73;
      break;
    case 'CO':
      m = -0.75; b = 1.73;
      break;
    default:
      return null;
  }
  const concentration = Math.pow(10, (Math.log10(ratio) - b) / m);
  return roundTo4(concentration);
}

/**
 * Функция расчёта концентрации для датчика MQ135.
 * Использует сырые данные raw и условные коэффициенты.
 * Если raw не положительный, возвращает null.
 * @param {number} raw - сырое значение, полученное с MQ135.
 * @param {string} gasType - тип газа ('Benzene', 'Alcohol' или 'Smoke').
 * @returns {number|null} концентрация в ppm, округленная до 4 знаков.
 */
function calculateMQ135Concentration(raw, gasType) {
  if (raw <= 0) return null;
  let m, b;
  switch (gasType) {
    case 'Benzene':
      m = -1.10; b = 1.10;
      break;
    case 'Alcohol':
      m = -0.87; b = 1.48;
      break;
    case 'Smoke':
      m = -0.75; b = 1.73;
      break;
    default:
      return null;
  }
  const concentration = Math.pow(10, (Math.log10(raw) - b) / m);
  return roundTo4(concentration);
}

/**
 * Функция readSensorData получает данные от Arduino через arduinoReader.getLatestData(),
 * проверяет наличие и корректность данных по DHT11, а затем, если данные для газов присутствуют,
 * конвертирует их в ожидаемый формат.
 */
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

    // Обработка данных для MQ9
    let mq9Converted = null;
    if (data.mq9 && typeof data.mq9.ratio === 'number') {
      mq9Converted = {
        LPG_ppm: calculateMQ9Concentration(data.mq9.ratio, 'LPG'),
        Methane_ppm: calculateMQ9Concentration(data.mq9.ratio, 'Methane'),
        CO_ppm: calculateMQ9Concentration(data.mq9.ratio, 'CO')
      };
    }

    // Обработка данных для MQ135
    let mq135Converted = null;
    if (data.mq135 && typeof data.mq135.raw === 'number') {
      mq135Converted = {
        Benzene_ppm: calculateMQ135Concentration(data.mq135.raw, 'Benzene'),
        Alcohol_ppm: calculateMQ135Concentration(data.mq135.raw, 'Alcohol'),
        Smoke_ppm: calculateMQ135Concentration(data.mq135.raw, 'Smoke')
      };
    }

    resolve({
      temperature: data.dht11.temperature,
      humidity: data.dht11.humidity,
      mq9: mq9Converted,
      mq135: mq135Converted
    });
  });
}

/**
 * Функция getValidSensorData делает несколько попыток получить валидные данные
 * с Arduino, используя readSensorData, с задержкой между попытками.
 * @param {number} maxAttempts - максимальное число попыток (по умолчанию 3)
 * @param {number} delayMs - задержка между попытками в мс (по умолчанию 2000)
 * @returns {Promise<Object>} валидные данные с датчиков.
 */
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
