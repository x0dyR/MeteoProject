const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');
const WeatherRecord = require('../models/weatherRecord');

exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await sensorService.readSensorData();
    const outdoorData = await outdoorWeatherService.getSensorData();

    // Создаем новую запись с данными
    const newRecord = new WeatherRecord({
      sensor: {
        temperature: parseFloat(sensorData.temperature),
        humidity: parseFloat(sensorData.humidity)
      },
      outdoor: {
        temperature: parseFloat(outdoorData.temperature),
        humidity: parseFloat(outdoorData.humidity) || null
      }
    });

    // Сохраняем запись в базе данных
    await newRecord.save();

    res.json({
      sensor: sensorData,
      outdoor: outdoorData,
      message: 'Данные сохранены в MongoDB'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
