// sensorController.js
const sensorService = require('../services/sensorService');
const outdoorWeatherService = require('../services/outdoorWeatherService');

exports.getSensorData = async (req, res) => {
  try {
    const sensorData = await sensorService.readSensorData();
    const outdoorTemp = await outdoorWeatherService.getSensorData();
    
    res.json({
      sensor: sensorData,
      outdoorTemperature: outdoorTemp
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
