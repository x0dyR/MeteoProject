// src/model/comfortSetting.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComfortSettingSchema = new Schema({
  idealIndoorTemp: { type: Number, required: true },
  idealIndoorHum: { type: Number, required: true },
  idealOutdoorTemp: { type: Number, required: true },
  idealOutdoorHum: { type: Number, required: true }
});

module.exports = mongoose.model('ComfortSetting', ComfortSettingSchema);
