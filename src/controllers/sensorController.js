// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const recommendationService = require('../services/recommendationService');
const mlService = require('../services/mlService');
const WeatherRecord = require('../model/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await sensorService.readSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();
    const comfortIndex = await mlService.predictComfort(sensorData, outdoorData);
    const recommendation = recommendationService.getComfortRecommendation(sensorData, outdoorData, comfortIndex);

    // Создаем запись для сохранения в MongoDB
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
