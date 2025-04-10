// src/controllers/sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const adviceService = require('../services/adviceService');
const mlService = require('../services/mlService');
const deviceControllerService = require('../services/deviceControllerService');
const WeatherRecord = require('../model/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await sensorService.getValidSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();

    // Пример расчета индекса комфорта (можно заменить на использование ML модели)
    const tempDifference = Math.abs(sensorData.temperature - outdoorData.temperature);
    const baseComfort = 1 - (tempDifference / 100);
    const comfortIndex = Math.max(0, Math.min(1, baseComfort));

    const recommendation = adviceService.getImprovementAdvice(sensorData, outdoorData, comfortIndex);

    // Сохраняем запись в MongoDB (если используется)
    const newRecord = new WeatherRecord({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex
    });
    await newRecord.save();

    // Получаем комфортные настройки (например, из adviceService или БД)
    const comfortableValues = await adviceService.getComfortableValues();

    // Вызываем функцию управления устройствами (например, включает кондиционер/увлажнитель)
    const deviceActions = deviceControllerService.controlDevices(sensorData, comfortableValues);
    console.log('[DEBUG] Команды для устройств:', deviceActions);

    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      comfortIndex: (comfortIndex * 100).toFixed(1) + '%',
      recommendation,
      deviceActions,
      message: 'Данные сохранены в MongoDB'
    });
  } catch (error) {
    console.error('Ошибка в контроллере:', error);
    res.status(500).json({ error: error.message });
  }
};
