// src/services/deviceControllerService.js

/**
 * Функция, которая на основе текущих данных принимает решение,
 * нужно ли включать или выключать кондиционер и увлажнитель.
 *
 * @param {Object} sensorData - данные с внутреннего датчика (например, { temperature, humidity })
 * @param {Object} options - настройки, содержащие желаемые значения и допуски
 * @returns {Object} Объект с командами для устройств, например:
 *                   { ac: "ON" или "OFF", humidifier: "ON" или "OFF" }
 */
exports.controlDevices = (sensorData, options = {}) => {
  // Значения по умолчанию:
  const desiredTemp = options.desiredTemp || 23;    // Желаемая внутренняя температура (°C)
  const tempTolerance = options.tempTolerance || 0.5; // Допуск по температуре (°C)
  const desiredHum = options.desiredHum || 50;        // Желаемая внутренняя влажность (%)
  const humTolerance = options.humTolerance || 5;     // Допуск по влажности (%)

  const actions = {};

  // Логика для кондиционера:
  if (sensorData.temperature > desiredTemp + tempTolerance) {
    actions.ac = "ON"; // Если температура выше желаемой с допуском – включаем кондиционер
  } else {
    actions.ac = "OFF"; // Иначе – выключаем
  }

  // Логика для увлажнителя:
  if (sensorData.humidity < desiredHum - humTolerance) {
    actions.humidifier = "ON"; // Если влажность ниже желаемой с допуском – включаем увлажнитель
  } else {
    actions.humidifier = "OFF"; // Иначе – выключаем
  }

  return actions;
};
