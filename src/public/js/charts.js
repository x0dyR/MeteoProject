// public/js/charts.js

// Ключи для хранения в localStorage
const LS_KEYS = {
  labels: 'chart_labels',
  indoorTemp: 'indoorTempData',
  indoorHum: 'indoorHumData',
  outdoorTemp: 'outdoorTempData',
  outdoorHum: 'outdoorHumData',
  mq9LPG: 'mq9LPGData',
  mq9Methane: 'mq9MethaneData',
  mq9CO: 'mq9COData',
  mq135Benzene: 'mq135BenzeneData',
  mq135Alcohol: 'mq135AlcoholData',
  mq135Smoke: 'mq135SmokeData'
};

// История для графиков (максимум 24 точки – по одной в час)
const historyLength = 24;
let labels = [];
let indoorTempData = [];
let indoorHumData = [];
let outdoorTempData = [];
let outdoorHumData = [];

// Если графики газов нужны – аналогично
let mq9LPGData = [];
let mq9MethaneData = [];
let mq9COData = [];
let mq135BenzeneData = [];
let mq135AlcoholData = [];
let mq135SmokeData = [];// Функция обновления графиков – использует глобальные переменные
function updateCharts() {
  // Если графики еще не созданы, то функция может просто завершаться.
  if (!indoorTempChart || !indoorHumChart || !outdoorTempChart || !outdoorHumChart || !mq9Chart || !mq135Chart) {
    console.warn("Графики не инициализированы.");
    return;
  }

  // Обновляем графики температуры/влажности
  indoorTempChart.data.labels = labels;
  indoorTempChart.data.datasets[0].data = indoorTempData;
  indoorTempChart.update();

  indoorHumChart.data.labels = labels;
  indoorHumChart.data.datasets[0].data = indoorHumData;
  indoorHumChart.update();

  outdoorTempChart.data.labels = labels;
  outdoorTempChart.data.datasets[0].data = outdoorTempData;
  outdoorTempChart.update();

  outdoorHumChart.data.labels = labels;
  outdoorHumChart.data.datasets[0].data = outdoorHumData;
  outdoorHumChart.update();

  // Обновляем графики для газовых датчиков MQ9
  mq9Chart.data.labels = labels;
  mq9Chart.data.datasets[0].data = mq9LPGData;
  mq9Chart.data.datasets[1].data = mq9MethaneData;
  mq9Chart.data.datasets[2].data = mq9COData;
  mq9Chart.update();

  // Обновляем графики для газовых датчиков MQ135
  mq135Chart.data.labels = labels;
  mq135Chart.data.datasets[0].data = mq135BenzeneData;
  mq135Chart.data.datasets[1].data = mq135AlcoholData;
  mq135Chart.data.datasets[2].data = mq135SmokeData;
  mq135Chart.update();
}


// Функции для сохранения и загрузки данных из localStorage
function saveHistory() {
  localStorage.setItem(LS_KEYS.labels, JSON.stringify(labels));
  localStorage.setItem(LS_KEYS.indoorTemp, JSON.stringify(indoorTempData));
  localStorage.setItem(LS_KEYS.indoorHum, JSON.stringify(indoorHumData));
  localStorage.setItem(LS_KEYS.outdoorTemp, JSON.stringify(outdoorTempData));
  localStorage.setItem(LS_KEYS.outdoorHum, JSON.stringify(outdoorHumData));
  localStorage.setItem(LS_KEYS.mq9LPG, JSON.stringify(mq9LPGData));
  localStorage.setItem(LS_KEYS.mq9Methane, JSON.stringify(mq9MethaneData));
  localStorage.setItem(LS_KEYS.mq9CO, JSON.stringify(mq9COData));
  localStorage.setItem(LS_KEYS.mq135Benzene, JSON.stringify(mq135BenzeneData));
  localStorage.setItem(LS_KEYS.mq135Alcohol, JSON.stringify(mq135AlcoholData));
  localStorage.setItem(LS_KEYS.mq135Smoke, JSON.stringify(mq135SmokeData));
}

function loadHistory() {
  labels = JSON.parse(localStorage.getItem(LS_KEYS.labels)) || [];
  indoorTempData = JSON.parse(localStorage.getItem(LS_KEYS.indoorTemp)) || [];
  indoorHumData = JSON.parse(localStorage.getItem(LS_KEYS.indoorHum)) || [];
  outdoorTempData = JSON.parse(localStorage.getItem(LS_KEYS.outdoorTemp)) || [];
  outdoorHumData = JSON.parse(localStorage.getItem(LS_KEYS.outdoorHum)) || [];
  mq9LPGData = JSON.parse(localStorage.getItem(LS_KEYS.mq9LPG)) || [];
  mq9MethaneData = JSON.parse(localStorage.getItem(LS_KEYS.mq9Methane)) || [];
  mq9COData = JSON.parse(localStorage.getItem(LS_KEYS.mq9CO)) || [];
  mq135BenzeneData = JSON.parse(localStorage.getItem(LS_KEYS.mq135Benzene)) || [];
  mq135AlcoholData = JSON.parse(localStorage.getItem(LS_KEYS.mq135Alcohol)) || [];
  mq135SmokeData = JSON.parse(localStorage.getItem(LS_KEYS.mq135Smoke)) || [];
}

// Пример функции агрегации данных – здесь можно добавить логику, если хотите агрегировать данные по часам
function addNewData(data) {
  // Генерируем метку времени (например, только время в формате HH:mm)
  const now = new Date();
  const label = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  labels.push(label);
  if (labels.length > historyLength) {
    labels.shift();
  }

  // Предполагается, что data имеет структуру:
  // { sensor: { temperature, humidity, mq9, mq135 }, outdoor: { temperature, humidity } }
  indoorTempData.push(data.sensor.temperature);
  indoorHumData.push(data.sensor.humidity);
  outdoorTempData.push(data.outdoor.temperature);
  outdoorHumData.push(data.outdoor.humidity);

  // Для газов – если они присутствуют. Если концентрация рассчитывается сервером, здесь просто сохраняем их значения.
  if (data.sensor.mq9) {
    mq9LPGData.push(data.sensor.mq9.LPG_ppm || null);
    mq9MethaneData.push(data.sensor.mq9.Methane_ppm || null);
    mq9COData.push(data.sensor.mq9.CO_ppm || null);
  }
  if (data.sensor.mq135) {
    mq135BenzeneData.push(data.sensor.mq135.Benzene_ppm || null);
    mq135AlcoholData.push(data.sensor.mq135.Alcohol_ppm || null);
    mq135SmokeData.push(data.sensor.mq135.Smoke_ppm || null);
  }

  // Ограничиваем длину истории
  if (indoorTempData.length > historyLength) {
    indoorTempData.shift();
    indoorHumData.shift();
    outdoorTempData.shift();
    outdoorHumData.shift();
    mq9LPGData.shift();
    mq9MethaneData.shift();
    mq9COData.shift();
    mq135BenzeneData.shift();
    mq135AlcoholData.shift();
    mq135SmokeData.shift();
  }

  // Сохраняем обновлённые данные в localStorage
  saveHistory();
}

// Глобальные переменные для графиков
let indoorTempChart, indoorHumChart, outdoorTempChart, outdoorHumChart;
let mq9Chart, mq135Chart;

document.addEventListener('DOMContentLoaded', () => {
  // При загрузке страницы, загружаем сохранённые данные
  loadHistory();

  // Создаем графики для температуры и влажности
  indoorTempChart = new Chart(document.getElementById('indoorTempChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Внутренняя температура (°C)',
        data: indoorTempData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            tooltipFormat: 'HH:mm',
            displayFormats: { hour: 'HH:mm' }
          },
          title: { display: true, text: 'Время' }
        },
        y: { title: { display: true, text: 'Температура (°C)' } }
      },
      animation: { duration: 0 }
    }
  });

  indoorHumChart = new Chart(document.getElementById('indoorHumChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Внутренняя влажность (%)',
        data: indoorHumData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'HH:mm', displayFormats: { hour: 'HH:mm' } }, title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Влажность (%)' } }
      },
      animation: { duration: 0 }
    }
  });

  outdoorTempChart = new Chart(document.getElementById('outdoorTempChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Наружная температура (°C)',
        data: outdoorTempData,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'HH:mm', displayFormats: { hour: 'HH:mm' } }, title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Температура (°C)' } }
      },
      animation: { duration: 0 }
    }
  });

  outdoorHumChart = new Chart(document.getElementById('outdoorHumChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Наружная влажность (%)',
        data: outdoorHumData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'HH:mm', displayFormats: { hour: 'HH:mm' } }, title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Влажность (%)' } }
      },
      animation: { duration: 0 }
    }
  });

  mq9Chart = new Chart(document.getElementById('mq9Chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'LPG (ppm)',
          data: mq9LPGData,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Methane (ppm)',
          data: mq9MethaneData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'CO (ppm)',
          data: mq9COData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'HH:mm', displayFormats: { hour: 'HH:mm' } }, title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Концентрация, ppm' } }
      },
      animation: { duration: 0 }
    }
  });

  mq135Chart = new Chart(document.getElementById('mq135Chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Benzene (ppm)',
          data: mq135BenzeneData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Alcohol (ppm)',
          data: mq135AlcoholData,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Smoke (ppm)',
          data: mq135SmokeData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'HH:mm', displayFormats: { hour: 'HH:mm' } }, title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Концентрация, ppm' } }
      },
      animation: { duration: 0 }
    }
  });

  // Начальное обновление данных с сервера
  updateData();
  setInterval(updateData, 5000);
});

// Функция, которая вызывается при каждом обновлении данных с сервера
function updateData() {
  fetch('/sensors')
    .then(response => response.json())
    .then(data => {
      // Добавляем новые данные в буфер и сохраняем их
      addNewData(data);
      // Обновляем графики с новыми данными
      indoorTempChart.data.labels = labels;
      indoorTempChart.data.datasets[0].data = indoorTempData;
      indoorTempChart.update();

      indoorHumChart.data.labels = labels;
      indoorHumChart.data.datasets[0].data = indoorHumData;
      indoorHumChart.update();

      outdoorTempChart.data.labels = labels;
      outdoorTempChart.data.datasets[0].data = outdoorTempData;
      outdoorTempChart.update();

      outdoorHumChart.data.labels = labels;
      outdoorHumChart.data.datasets[0].data = outdoorHumData;
      outdoorHumChart.update();

      mq9Chart.data.labels = labels;
      mq9Chart.data.datasets[0].data = mq9LPGData;
      mq9Chart.data.datasets[1].data = mq9MethaneData;
      mq9Chart.data.datasets[2].data = mq9COData;
      mq9Chart.update();

      mq135Chart.data.labels = labels;
      mq135Chart.data.datasets[0].data = mq135BenzeneData;
      mq135Chart.data.datasets[1].data = mq135AlcoholData;
      mq135Chart.data.datasets[2].data = mq135SmokeData;
      mq135Chart.update();
    })
    .catch(err => {
      console.error('Ошибка получения данных с сервера:', err);
    });
}
