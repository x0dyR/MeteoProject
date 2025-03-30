// src/services/recommendationService.js

/**
 * Генерирует рекомендации по комфортным условиям на основе внутренних (sensorData)
 * и внешних (outdoorData) показателей.
 *
 * @param {Object} sensorData - данные от сенсора { temperature, humidity }
 * @param {Object} outdoorData - данные с сайта { temperature, humidity }
 * @returns {String} Рекомендации
 */
exports.getComfortRecommendation = (sensorData, outdoorData) => {
    const recommendations = [];
  
    // Рекомендации по внутренним условиям
    if (sensorData.temperature < 22) {
      recommendations.push("Температура в помещении ниже комфортной. Рекомендуется повысить отопление");
    } else if (sensorData.temperature > 24) {
      recommendations.push("Температура в помещении выше комфортной. Рекомендуется снизить температуру");
    } else {
      recommendations.push("Температура в помещении комфортная");
    }
  
    if (sensorData.humidity < 40) {
      recommendations.push("Влажность в помещении низкая. Рекомендуется увлажнить воздух");
    } else if (sensorData.humidity > 60) {
      recommendations.push("Влажность в помещении высокая. Рекомендуется снизить влажность");
    } else {
      recommendations.push("Влажность в помещении оптимальная");
    }
  
    // Рекомендации по внешним условиям
    if (outdoorData.temperature < 10) {
      recommendations.push("На улице холодно. Одевайтесь тепло");
    } else if (outdoorData.temperature > 30) {
      recommendations.push("На улице жарко. Не забудьте пить воду и использовать солнцезащитные средства");
    } else {
      recommendations.push("Температура на улице комфортная");
    }
  
    // Если влажность снаружи получена
    if (outdoorData.humidity !== undefined && outdoorData.humidity !== null) {
      if (outdoorData.humidity < 30) {
        recommendations.push("Влажность на улице низкая");
      } else if (outdoorData.humidity > 70) {
        recommendations.push("Влажность на улице высокая");
      } else {
        recommendations.push("Влажность на улице оптимальная");
      }
    }
  
    return recommendations.join(". ") + ".";
  };
  