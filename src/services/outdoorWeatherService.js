const axios = require('axios');
const cheerio = require('cheerio');

exports.getOutdoorTemperature = async () => {
  try {
    const { data: html } = await axios.get('https://www.gismeteo.kz/weather-almaty-5205/');
    const $ = cheerio.load(html);
    
    // Ищем div с классом "weather-value", затем внутри него элемент с классом "temperature-value"
    const tempText = $('div.weather-value')
      .find('.temperature-value')
      .first()
      .text()
      .trim();
    
    // Преобразуем строку в число (убираем лишние символы, если они есть)
    const temperature = parseFloat(tempText.replace(/[^\d\.\-]/g, ''));
    
    if (isNaN(temperature)) {
      throw new Error('Не удалось распознать температуру с сайта');
    }
    
    return temperature;
  } catch (error) {
    console.error('Ошибка при получении внешней температуры:', error.message);
    throw error;
  }
};
