const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeatherRecordSchema = new Schema({
    sensor: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true }
    },
    outdoor: {
        temperature: { type: Number, required: true },
        humidity: { type: Number } // если влажность с сайта не всегда доступна
    },
    comfortIndex: { type: Number },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('WeatherRecord', WeatherRecordSchema);
