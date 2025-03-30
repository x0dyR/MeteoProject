const sensorService = require('../services/sensorService');

exports.getSensorData = async (req, res) => {
  try {
    const data = await sensorService.readSensorData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
