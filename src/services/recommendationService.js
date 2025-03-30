// src/services/recommendationService.js

/**
 * Функция выдачи рекомендаций для достижения максимального комфорта.
 * Принимает текущие данные и индекс комфорта, и возвращает подробный текст рекомендаций.
 *
 * @param {Object} sensorData - данные с датчика { temperature, humidity }
 * @param {Object} outdoorData - данные с внешнего источника { temperature, humidity }
 * @param {Number} comfortIndex - текущий индекс комфорта (от 0 до 1)
 * @returns {String} Рекомендации по корректировке условий для максимального комфорта.
 */
exports.getComfortRecommendation = (sensorData, outdoorData, comfortIndex) => {
    const recommendations = [];
  
    // Задаем идеальные значения для внутреннего климата
    const idealIndoorTemp = 23; // °C
    const idealIndoorHum = 50;  // %
  
    // Рекомендации на основе текущего индекса комфорта
    if (comfortIndex < 0.5) {
      recommendations.push("Уровень комфорта низкий.");
    } else if (comfortIndex < 0.8) {
      recommendations.push("Уровень комфорта умеренный.");
    } else {
      recommendations.push("Уровень комфорта отличный.");
    }
  
    // Рекомендации для внутренней температуры:
    if (sensorData.temperature < idealIndoorTemp) {
      const diff = (idealIndoorTemp - sensorData.temperature).toFixed(1);
      recommendations.push(`Чтобы достичь максимального комфорта, увеличьте температуру в помещении на ${diff}°C.`);
    } else if (sensorData.temperature > idealIndoorTemp) {
      const diff = (sensorData.temperature - idealIndoorTemp).toFixed(1);
      recommendations.push(`Чтобы достичь максимального комфорта, снизьте температуру в помещении на ${diff}°C.`);
    } else {
      recommendations.push("Температура в помещении уже оптимальна.");
    }
  
    // Рекомендации для внутренней влажности:
    if (sensorData.humidity < idealIndoorHum) {
      const diff = (idealIndoorHum - sensorData.humidity).toFixed(0);
      recommendations.push(`Чтобы достичь максимального комфорта, увеличьте влажность в помещении на ${diff}%.`);
    } else if (sensorData.humidity > idealIndoorHum) {
      const diff = (sensorData.humidity - idealIndoorHum).toFixed(0);
      recommendations.push(`Чтобы достичь максимального комфорта, уменьшите влажность в помещении на ${diff}%.`);
    } else {
      recommendations.push("Влажность в помещении уже оптимальна.");
    }
  
    // Рекомендации для внешних условий (просто информативно):
    if (outdoorData.temperature < 10) {
      recommendations.push("На улице холодно – одевайтесь тепло.");
    } else if (outdoorData.temperature > 30) {
      recommendations.push("На улице жарко – соблюдайте меры предосторожности, пейте воду.");
    } else {
      recommendations.push("Температура на улице комфортная.");
    }
  
    if (outdoorData.humidity < 30) {
      recommendations.push("Влажность на улице низкая.");
    } else if (outdoorData.humidity > 70) {
      recommendations.push("Влажность на улице высокая.");
    } else {
      recommendations.push("Влажность на улице оптимальная.");
    }
  
    return recommendations.join(' ');
  };
  