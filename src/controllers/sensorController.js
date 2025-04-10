// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const mlService = require('../services/mlService');
const WeatherRecord = require('../model/weatherRecord');
const adviceService = require('../services/adviceService');

exports.getSensorData = async (req, res) => {
  try {
    // Используем getValidSensorData вместо readSensorData для получения актуальных данных
    const sensorData = await sensorService.getValidSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();

    // Предсказываем индекс комфорта с помощью ML
    const comfortIndex = await mlService.predictComfort(sensorData, outdoorData);

    // Получаем рекомендации с учетом установленных комфортных значений
    const recommendation = adviceService.getImprovementAdvice(sensorData, outdoorData, comfortIndex);

    // Создаем запись для сохранения в MongoDB (если используется)
    const newRecord = new WeatherRecord({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex
    });
    await newRecord.save();

    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex: (comfortIndex * 100).toFixed(1) + '%',
      recommendation,
      message: 'Данные сохранены в MongoDB'
    });
  } catch (error) {
    console.error('Ошибка в контроллере:', error);
    res.status(500).json({ error: error.message });
  }
};
