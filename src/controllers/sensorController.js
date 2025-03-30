// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const recommendationService = require('../services/recommendationService');
const WeatherRecord = require('../model/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    // Получаем данные с сенсора и с внешнего источника
    const sensorData = await sensorService.readSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();

    // Формируем рекомендации для комфортного уровня
    const recommendation = recommendationService.getComfortRecommendation(sensorData, outdoorData);

    // Создаем запись для сохранения в MongoDB
    const newRecord = new WeatherRecord({
      sensor: {
        temperature: parseFloat(sensorData.temperature),
        humidity: parseFloat(sensorData.humidity)
      },
      outdoor: {
        temperature: parseFloat(outdoorData.temperature),
        humidity: outdoorData.humidity ? parseFloat(outdoorData.humidity) : null
      }
    });

    // Сохраняем запись в базе
    await newRecord.save();

    // Отправляем данные и рекомендации в ответе
    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      recommendation,
      message: 'Данные сохранены в MongoDB'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
