// src/model/weatherRecord.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // определяем Schema

const WeatherRecordSchema = new Schema({
  sensor: {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true }
  },
  outdoor: {
    temperature: { type: Number },
    humidity: { type: Number }
  },
  comfortIndex: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeatherRecord', WeatherRecordSchema);
