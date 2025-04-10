// src/services/adviceService.js
const ComfortSetting = require('../model/comfortSetting');

async function getComfortableValues() {
  // Пытаемся найти документ с комфортными настройками
  let settings = await ComfortSetting.findOne({});
  // Если нет записи – возвращаем значения по умолчанию
  if (!settings) {
    settings = {
      idealIndoorTemp: 23,
      idealIndoorHum: 50,
      idealOutdoorTemp: 20,
      idealOutdoorHum: 50
    };
  }
  return settings;
}

/**
 * Формирует рекомендации на основе данных с датчиков, внешних данных и комфортных значений.
 * @param {Object} sensorData - { temperature, humidity, ... }
 * @param {Object} outdoorData - { temperature, humidity, precipitation, ... }
 * @param {Number} comfortIndex - индекс комфорта (от 0 до 1)
 * @returns {String} Итоговая строка с рекомендациями.
 */
async function getImprovementAdvice(sensorData, outdoorData, comfortIndex) {
  const settings = await getComfortableValues();
  const idealIndoorTemp = settings.idealIndoorTemp;
  const idealIndoorHum = settings.idealIndoorHum;
  const idealOutdoorTemp = settings.idealOutdoorTemp;
  const idealOutdoorHum = settings.idealOutdoorHum;

  const advice = [];
  
  // Рекомендации по внутреннему климату:
  if (sensorData.temperature > idealIndoorTemp) {
    const diff = (sensorData.temperature - idealIndoorTemp).toFixed(1);
    advice.push(`Снизьте температуру в помещении на ${diff}°C`);
  } else if (sensorData.temperature < idealIndoorTemp) {
    const diff = (idealIndoorTemp - sensorData.temperature).toFixed(1);
    advice.push(`Повысьте температуру в помещении на ${diff}°C`);
  } else {
    advice.push('Температура в помещении оптимальна');
  }
  
  if (sensorData.humidity < idealIndoorHum) {
    const diff = (idealIndoorHum - sensorData.humidity).toFixed(0);
    advice.push(`Увеличьте влажность в помещении на ${diff}%`);
  } else if (sensorData.humidity > idealIndoorHum) {
    const diff = (sensorData.humidity - idealIndoorHum).toFixed(0);
    advice.push(`Снизьте влажность в помещении на ${diff}%`);
  } else {
    advice.push('Влажность в помещении оптимальна');
  }
  
  // Рекомендации по внешним условиям:
  if (outdoorData.temperature < idealOutdoorTemp) {
    advice.push('На улице холодно — возможно, стоит утеплиться');
  } else if (outdoorData.temperature > idealOutdoorTemp) {
    advice.push('На улице жарко — подумайте о проветривании в более прохладное время');
  } else {
    advice.push('Температура на улице комфортная');
  }
  
  if (outdoorData.humidity < idealOutdoorHum) {
    advice.push('Влажность на улице низкая');
  } else if (outdoorData.humidity > idealOutdoorHum) {
    advice.push('Влажность на улице высокая');
  } else {
    advice.push('Влажность на улице оптимальна');
  }
  
  // Если имеется значение осадков, добавляем рекомендацию по зонтику
  if (typeof outdoorData.precipitation === 'number') {
    if (outdoorData.precipitation > 0.2) {
      advice.push('Осадки значительные, возьмите зонтик');
    } else {
      advice.push('Осадки незначительные');
    }
  }
  
  return advice.join('. ') + '.';
}

/**
 * Обновляет комфортные значения в базе данных.
 * Если документ уже существует, он обновляется; иначе создаётся новый.
 * @param {Object} newValues - { idealIndoorTemp, idealIndoorHum, idealOutdoorTemp, idealOutdoorHum }
 * @returns Обновлённый документ.
 */
async function updateComfortableValues(newValues) {
  try {
    const updated = await ComfortSetting.findOneAndUpdate(
      {},
      newValues,
      { new: true, upsert: true }
    );
    console.log('Обновлены комфортные значения:', updated);
    return updated;
  } catch (err) {
    console.error('Ошибка обновления комфортных значений:', err);
    throw err;
  }
}

module.exports = {
  getImprovementAdvice,
  updateComfortableValues,
  getComfortableValues
};
