// src/services/mlService.js
const tf = require('@tensorflow/tfjs-node');
const mongoose = require('mongoose');
const WeatherRecord = require('../models/weatherRecord');

/**
 * Функция для обучения модели на исторических данных.
 * В этом примере предполагается, что модель пытается предсказать комфортный индекс.
 */
async function trainModel() {
  // Загружаем данные из MongoDB (здесь предполагается, что у вас достаточно записей)
  const records = await WeatherRecord.find({}).lean();
  
  // Подготовка данных: преобразуем записи в массивы входных данных и целевых значений.
  // Для простоты примера считаем, что целевой индекс рассчитывается по некоторой формуле,
  // например, чем ближе внутренняя температура к 23°C и влажность к 50%, тем выше индекс.
  const inputs = [];
  const labels = [];
  records.forEach(rec => {
    const sensorTemp = rec.sensor.temperature;
    const sensorHum = rec.sensor.humidity;
    const outdoorTemp = rec.outdoor.temperature;
    const outdoorHum = rec.outdoor.humidity || 50; // если отсутствует, берем 50
    
    // Пример простейшей функции комфорта (это можно заменить на реальные данные)
    const comfortIndex = 1 - (
      Math.abs(sensorTemp - 23) / 20 +
      Math.abs(sensorHum - 50) / 50 +
      Math.abs(outdoorTemp - 20) / 30 +
      Math.abs(outdoorHum - 50) / 50
    ) / 4;
    
    inputs.push([sensorTemp, sensorHum, outdoorTemp, outdoorHum]);
    labels.push([comfortIndex]); // индикатор комфорта от 0 до 1
  });
  
  // Преобразуем данные в тензоры
  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor2d(labels);

  // Определяем архитектуру модели
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // индекс комфорта от 0 до 1

  model.compile({
    optimizer: tf.train.adam(),
    loss: 'meanSquaredError'
  });

  console.log('Начало обучения модели...');
  await model.fit(inputTensor, labelTensor, {
    epochs: 50,
    batchSize: 8,
    shuffle: true
  });
  console.log('Обучение завершено.');

  // Сохраняем модель на диск для последующего использования
  await model.save('file://./model');
  console.log('Модель сохранена в ./model');
  
  return model;
}

/**
 * Функция для загрузки обученной модели.
 */
async function loadModel() {
  try {
    const model = await tf.loadLayersModel('file://./model/model.json');
    console.log('Модель загружена');
    return model;
  } catch (error) {
    console.error('Не удалось загрузить модель, требуется обучение:', error.message);
    // Если модель не найдена, обучаем её
    return await trainModel();
  }
}

/**
 * Функция, которая принимает данные и возвращает прогноз комфорта.
 * @param {Object} sensorData - { temperature, humidity }
 * @param {Object} outdoorData - { temperature, humidity }
 * @returns {Number} Комфортный индекс от 0 до 1
 */
async function predictComfort(sensorData, outdoorData) {
  const model = await loadModel();
  const input = tf.tensor2d([[
    sensorData.temperature,
    sensorData.humidity,
    outdoorData.temperature,
    outdoorData.humidity || 50
  ]]);
  
  const prediction = model.predict(input);
  const comfortIndex = prediction.dataSync()[0];
  
  return comfortIndex;
}

module.exports = {
  trainModel,
  predictComfort
};
