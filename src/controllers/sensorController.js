const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const recommendationService = require('../services/recommendationService');
const mlService = require('../services/mlService');
// Если вы сохраняете в MongoDB, подключаем модель
// const WeatherRecord = require('../model/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    // Пример: получаем внутренние данные
    const sensorData = await sensorService.readSensorData();
    // Пример: получаем данные извне (Gismeteo)
    const outdoorData = await outdoorWeatherService.getSensorData();
    // Пример: считаем индекс комфорта
    const comfortIndex = await mlService.predictComfort(sensorData, outdoorData);
    // Пример: рекомендации
    const recommendation = recommendationService.getComfortRecommendation(
      sensorData,
      outdoorData,
      comfortIndex
    );

    // Если нужно — сохраняем в БД
    // const newRecord = new WeatherRecord({ ... });
    // await newRecord.save();

    // Возвращаем JSON-ответ
    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex,
      recommendation
    });
  } catch (error) {
    // В случае ошибки возвращаем JSON с полем error
    res.status(500).json({ error: error.message });
  }
};
