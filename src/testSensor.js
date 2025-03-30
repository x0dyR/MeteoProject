const sensor = require('node-dht-sensor-rp5');

// Инициализируем датчик
const initialized = sensor.initialize(11, 4);
console.log('Инициализация датчика:', initialized);

if (!initialized) {
  console.error('Ошибка инициализации датчика');
  process.exit(1);
}

setTimeout(() => {
  sensor.read(11, 4, (err, temperature, humidity, isValid, errors) => {
    if (err) {
      console.error('Ошибка чтения датчика:', err);
    } else {
      console.log('Считанные данные:', { temperature, humidity, isValid, errors });
    }
  });
}, 3000);
