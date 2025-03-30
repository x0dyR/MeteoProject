const axios = require('axios');
const cheerio = require('cheerio');

exports.getOutdoorTemperature = async () => {
  try {
    // Выполняем GET-запрос к странице с погодой
    const { data: html } = await axios.get('https://www.gismeteo.kz/weather-almaty-5205/');
    
    // Загружаем HTML в cheerio
    const $ = cheerio.load(html);
    
    // Находим элемент, содержащий температуру.
    // Пример селектора: '.now-info__value'
    // Если сайт изменил верстку, придется обновить селектор.
    const tempElement = $('.now-info__value').first();
    let tempText = tempElement.text().trim();
    
    // Убираем лишние символы и преобразуем в число
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
