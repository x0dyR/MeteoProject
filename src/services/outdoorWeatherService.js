// outdoorWeatherService.js
const axios = require('axios');
const cheerio = require('cheerio');

exports.getSensorData = async () => {
  try {
    // Выполняем GET-запрос к нужному адресу
    const { data: html } = await axios.get('https://www.gismeteo.kz/weather-almaty-5205/now/');
    
    // Загружаем HTML для парсинга
    const $ = cheerio.load(html);
    
    // Извлекаем температуру из секции с классом "now-weather"
    const temperature = $('.now-weather temperature-value')
      .first()
      .attr('value');
    
    // Извлекаем влажность, найдя блок, в котором заголовок равен "Влажность"
    let humidity = null;
    $('div.now-info-item').each((i, el) => {
      const title = $(el).find('.item-title').text().trim();
      if (title === 'Влажность') {
        humidity = $(el).find('.item-value').text().trim();
        return false; // прерываем цикл, если нашли
      }
    });
    
    if (!temperature) {
      throw new Error('Не удалось найти температуру');
    }
    if (!humidity) {
      throw new Error('Не удалось найти влажность');
    }
    
    // Преобразуем строки в числа
    return {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity)
    };
  } catch (error) {
    console.error('Ошибка при получении данных с сайта:', error.message);
    throw error;
  }
};
