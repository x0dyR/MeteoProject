// outdoorWeatherService.js
const axios = require('axios');
const cheerio = require('cheerio');

exports.getSensorData = async () => {
  try {
    // Выполняем запрос к сайту
    const { data: html } = await axios.get('https://www.gismeteo.kz/weather-almaty-5205/');
    
    // Загружаем HTML в cheerio
    const $ = cheerio.load(html);
    
    // Ищем первый элемент <temperature-value> внутри div.weather-value
    const temperature = $('div.weather-value')
      .find('temperature-value')
      .first()
      .attr('value');
    
    if (!temperature) {
      throw new Error('Не удалось найти температуру');
    }
    
    console.log('Температура:', temperature);
    return temperature;
  } catch (error) {
    console.error('Ошибка при получении внешней температуры:', error.message);
    throw error;
  }
};
