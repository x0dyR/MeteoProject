// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const recommendationService = require('../services/recommendationService');
const mlService = require('../services/mlService');
const WeatherRecord = require('../models/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    // Получаем данные с сенсора и с внешнего источника
    const sensorData = await sensorService.readSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();

    // Получаем индекс комфорта с помощью ML модели
    const comfortIndex = await mlService.predictComfort(sensorData, outdoorData);
    
    // Формируем рекомендации, можно адаптировать функцию рекомендаций с учетом ML
    const recommendation = recommendationService.getComfortRecommendation(sensorData, outdoorData, comfortIndex);

    // Создаем запись для сохранения в MongoDB
    const newRecord = new WeatherRecord({
      sensor: {
        temperature: parseFloat(sensorData.temperature),
        humidity: parseFloat(sensorData.humidity)
      },
      outdoor: {
        temperature: parseFloat(outdoorData.temperature),
        humidity: outdoorData.humidity ? parseFloat(outdoorData.humidity) : null
      },
      comfortIndex // Можно добавить поле комфорта в модель WeatherRecord
    });

    await newRecord.save();

    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex,
      recommendation,
      message: 'Данные сохранены в MongoDB'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
