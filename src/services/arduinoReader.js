const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Имя последовательного порта, например, /dev/ttyUSB0 (проверьте командой ls /dev/ttyACM* или ls /dev/ttyUSB*)
const portName = '/dev/ttyUSB0';

const port = new SerialPort({
  path: portName,
  baudRate: 9600,
  autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

port.open((err) => {
  if (err) {
    return console.error('Ошибка открытия порта:', err.message);
  }
  console.log(`Порт ${portName} успешно открыт`);
});

let latestData = null;

parser.on('data', (line) => {
  const jsonStart = line.indexOf('{');
  if (jsonStart === -1) {
    console.error('Строка не содержит JSON:', line.trim());
    return;
  }
  const jsonString = line.substring(jsonStart).trim();
  try {
    const data = JSON.parse(jsonString);
    console.log('Получены данные с Arduino:', data);
    latestData = data;
  } catch (err) {
    console.error('Ошибка парсинга JSON:', err);
  }
});

port.on('error', (err) => {
  console.error('Ошибка последовательного порта:', err);
});

module.exports = {
  getLatestData: () => latestData,
};
