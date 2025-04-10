// src/services/recommendationService.js

exports.getComfortRecommendation = (sensorData, outdoorData, comfortIndex) => {
  const recommendations = [];
  // Задаем идеальные значения для внутреннего климата:
  const idealIndoorTemp = 23; // °C
  const idealIndoorHum = 50;  // %

  // Рекомендации для температуры в помещении
  if (sensorData.temperature < idealIndoorTemp) {
    const diff = (idealIndoorTemp - sensorData.temperature).toFixed(1);
    recommendations.push(`Чтобы достичь максимального комфорта, увеличьте температуру в помещении на ${diff}°C`);
  } else if (sensorData.temperature > idealIndoorTemp) {
    const diff = (sensorData.temperature - idealIndoorTemp).toFixed(1);
    recommendations.push(`Чтобы достичь максимального комфорта, снизьте температуру в помещении на ${diff}°C`);
  } else {
    recommendations.push("Температура в помещении уже оптимальна");
  }

  // Рекомендации для влажности в помещении
  if (sensorData.humidity < idealIndoorHum) {
    const diff = (idealIndoorHum - sensorData.humidity).toFixed(0);
    recommendations.push(`Чтобы достичь максимального комфорта, увеличьте влажность в помещении на ${diff}%`);
  } else if (sensorData.humidity > idealIndoorHum) {
    const diff = (sensorData.humidity - idealIndoorHum).toFixed(0);
    recommendations.push(`Чтобы достичь максимального комфорта, уменьшите влажность в помещении на ${diff}%`);
  } else {
    recommendations.push("Влажность в помещении уже оптимальна");
  }

  // Дополнительные рекомендации по внешним условиям:
  if (outdoorData.temperature < 10) {
    recommendations.push("На улице холодно, одевайтесь тепло");
  } else if (outdoorData.temperature > 30) {
    recommendations.push("На улице жарко, соблюдайте меры предосторожности");
  } else {
    recommendations.push("Температура на улице комфортная");
  }

  if (outdoorData.humidity < 30) {
    recommendations.push("Влажность на улице низкая");
  } else if (outdoorData.humidity > 70) {
    recommendations.push("Влажность на улице высокая");
  } else {
    recommendations.push("Влажность на улице оптимальная");
  }

  // Можно добавить дополнительную логику на основе comfortIndex, если необходимо.
  // Например, если индекс комфорта ниже порогового значения, добавить специальное уведомление.
  if (typeof comfortIndex !== 'undefined') {
    if (comfortIndex < 50) {
      recommendations.push("Общий индекс комфорта низкий, рекомендуется проверить систему кондиционирования");
    } else if (comfortIndex > 80) {
      recommendations.push("Общий индекс комфорта высокий, продолжайте в том же духе");
    }
  }

  // Возвращаем рекомендации в виде одной строки
  return recommendations.join('. ') + '.';
};
