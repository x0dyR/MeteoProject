// src/services/arduinoReader.js
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Укажите правильное имя последовательного порта, например, '/dev/ttyACM0' или '/dev/ttyUSB0'
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', (line) => {
  try {
    const data = JSON.parse(line);
    console.log('Данные с Arduino:', data);
  } catch (err) {
    console.error('Ошибка парсинга данных с Arduino:', err);
  }
});

port.on('error', (err) => console.error('SerialPort error:', err));
