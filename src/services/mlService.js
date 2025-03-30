const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

/**
 * Обучает модель на синтетических данных.
 * Вход: [sensorTemp, sensorHum, outdoorTemp, outdoorHum]
 * Выход: комфортный индекс от 0 до 1.
 */
async function trainModel() {
  const NUM_SAMPLES = 100;
  const idealIndoorTemp = 23, idealIndoorHum = 50;
  const idealOutdoorTemp = 20, idealOutdoorHum = 50;

  const inputs = [];
  const labels = [];

  // Генерируем синтетические данные
  for (let i = 0; i < NUM_SAMPLES; i++) {
    const sensorTemp = 18 + Math.random() * 10;  // от 18 до 28°C
    const sensorHum = 30 + Math.random() * 40;     // от 30% до 70%
    const outdoorTemp = 10 + Math.random() * 15;     // от 10 до 25°C
    const outdoorHum = 30 + Math.random() * 40;      // от 30% до 70%
    inputs.push([sensorTemp, sensorHum, outdoorTemp, outdoorHum]);

    // Простейшая функция комфорта: чем ближе к идеалу, тем выше индекс
    const index = 1 - (
      Math.abs(sensorTemp - idealIndoorTemp) / 10 +
      Math.abs(sensorHum - idealIndoorHum) / 40 +
      Math.abs(outdoorTemp - idealOutdoorTemp) / 15 +
      Math.abs(outdoorHum - idealOutdoorHum) / 40
    ) / 4;
    labels.push([index]);
  }

  // Преобразуем данные в тензоры
  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor2d(labels);

  // Создаем модель
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // выход от 0 до 1

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

  // Сохраняем модель в папку ml_model (создайте её в корне проекта)
  await model.save('file://./ml_model');
  console.log('Модель сохранена в папке ml_model');

  return model;
}

/**
 * Загружает обученную модель из папки ml_model.
 * Если модели нет, запускает процесс обучения.
 */
async function loadModel() {
  const modelPath = './ml_model/model.json';
  if (fs.existsSync(modelPath)) {
    const model = await tf.loadLayersModel('file://./ml_model/model.json');
    console.log('Модель загружена с диска.');
    return model;
  } else {
    console.log('Модель не найдена, начинаем обучение...');
    return await trainModel();
  }
}

/**
 * Предсказывает индекс комфорта на основе данных с датчика и внешних данных.
 * @param {Object} sensorData - { temperature, humidity }
 * @param {Object} outdoorData - { temperature, humidity }
 * @returns {Number} комфортный индекс (от 0 до 1)
 */
async function predictComfort(sensorData, outdoorData) {
  const model = await loadModel();
  const inputTensor = tf.tensor2d([[
    sensorData.temperature,
    sensorData.humidity,
    outdoorData.temperature,
    outdoorData.humidity || 50
  ]]);
  
  const prediction = model.predict(inputTensor);
  const comfortIndex = prediction.dataSync()[0];
  return comfortIndex;
}

module.exports = {
  trainModel,
  loadModel,
  predictComfort
};
