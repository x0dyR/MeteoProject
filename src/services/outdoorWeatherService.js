const cheerio = require('cheerio');

// Здесь вставьте HTML, например, в переменную html
const html = `<!doctype html> ... </html>`; // Ваш HTML код

const $ = cheerio.load(html);

// Ищем первый элемент <temperature-value> внутри div.weather-value
const temperature = $('div.weather-value')
  .find('temperature-value')
  .first()
  .attr('value');

console.log('Температура:', temperature);
