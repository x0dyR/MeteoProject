// src/services/adviceService.js
let comfortableValues = {
    idealIndoorTemp: 23,
    idealIndoorHum: 50,
    idealOutdoorTemp: 20,
    idealOutdoorHum: 50,
  };
  
  function updateComfortableValues(newValues) {
    comfortableValues = newValues;
    console.log('Обновлены комфортные значения в сервисе рекомендаций:', comfortableValues);
  }
  
  /**
   * Формирует рекомендации на основе данных с датчиков и комфортных параметров.
   * @param {Object} sensorData - { temperature, humidity, mq9, mq135 }
   * @param {Object} outdoorData - { temperature, humidity }
   * @param {Number} comfortIndex - индекс комфорта (от 0 до 1)
   * @returns {String} Рекомендации
   */
  function getImprovementAdvice(sensorData, outdoorData, comfortIndex) {
    const advice = [];
    const idealIndoorTemp = comfortableValues.idealIndoorTemp;
    const idealIndoorHum = comfortableValues.idealIndoorHum;
    const idealOutdoorTemp = comfortableValues.idealOutdoorTemp;
    const idealOutdoorHum = comfortableValues.idealOutdoorHum;
  
    if (sensorData.temperature > idealIndoorTemp) {
      const diff = (sensorData.temperature - idealIndoorTemp).toFixed(1);
      advice.push(`Снизьте температуру в помещении на ${diff}°C.`);
    } else if (sensorData.temperature < idealIndoorTemp) {
      const diff = (idealIndoorTemp - sensorData.temperature).toFixed(1);
      advice.push(`Повысьте температуру в помещении на ${diff}°C.`);
    } else {
      advice.push('Температура в помещении оптимальна.');
    }
  
    if (sensorData.humidity < idealIndoorHum) {
      const diff = (idealIndoorHum - sensorData.humidity).toFixed(0);
      advice.push(`Увеличьте влажность в помещении на ${diff}%.`);
    } else if (sensorData.humidity > idealIndoorHum) {
      const diff = (sensorData.humidity - idealIndoorHum).toFixed(0);
      advice.push(`Снизьте влажность в помещении на ${diff}%.`);
    } else {
      advice.push('Влажность в помещении оптимальна.');
    }
  
    if (outdoorData.temperature < idealOutdoorTemp) {
      advice.push('На улице холодно — возможно, стоит утеплиться.');
    } else if (outdoorData.temperature > idealOutdoorTemp) {
      advice.push('На улице жарко — подумайте о проветривании в более прохладное время.');
    } else {
      advice.push('Температура на улице комфортная.');
    }
    
    if (outdoorData.humidity < idealOutdoorHum) {
      advice.push('Влажность на улице низкая.');
    } else if (outdoorData.humidity > idealOutdoorHum) {
      advice.push('Влажность на улице высокая.');
    } else {
      advice.push('Влажность на улице оптимальна.');
    }
    
    // Если требуется — добавьте рекомендации для газовых датчиков
    
    return advice.join(' ');
  }
  
  module.exports = {
    getImprovementAdvice,
    updateComfortableValues
  };
  