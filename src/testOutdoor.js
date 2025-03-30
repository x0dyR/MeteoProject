// src/testOutdoor.js
const outdoorWeatherService = require('./services/outdoorWeatherService');

outdoorWeatherService.getSensorData()
  .then(data => {
    console.log('Outdoor data:', data);
  })
  .catch(err => {
    console.error('Error in outdoorWeatherService:', err);
  });
