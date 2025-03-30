// src/services/recommendationService.js

exports.getComfortRecommendation = (sensorData, outdoorData, comfortIndex) => {
    const recommendations = [];
    
    // Пример: если индекс ниже 0.5, рекомендации более агрессивны
    if (comfortIndex < 0.5) {
      recommendations.push("Комфорт низкий, рекомендуется оптимизировать климат в помещении");
    } else if (comfortIndex < 0.8) {
      recommendations.push("Комфорт умеренный, можно немного улучшить условия");
    } else {
      recommendations.push("Уровень комфорта отличный");
    }
    
    // Дополнительные рекомендации по внутренним и внешним условиям можно оставить
    if (sensorData.temperature < 22) {
      recommendations.push("Температура в помещении ниже оптимальной, увеличьте отопление");
    } else if (sensorData.temperature > 24) {
      recommendations.push("Температура в помещении выше оптимальной, уменьшите температуру");
    }
    
    if (sensorData.humidity < 40) {
      recommendations.push("Влажность в помещении низкая, увлажните воздух");
    } else if (sensorData.humidity > 60) {
      recommendations.push("Влажность в помещении высокая, уменьшите её");
    }
    
    if (outdoorData.temperature < 10) {
      recommendations.push("На улице холодно, одевайтесь теплее");
    } else if (outdoorData.temperature > 30) {
      recommendations.push("На улице жарко, соблюдайте меры предосторожности");
    }
    
    return recommendations.join('. ') + '.';
  };
  