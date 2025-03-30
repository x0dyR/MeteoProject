class SensorData {
    constructor(temperature, humidity) {
      this.temperature = temperature;
      this.humidity = humidity;
      this.timestamp = new Date();
    }
  }
  
  module.exports = SensorData;
  