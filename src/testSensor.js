var sensor = require("node-dht-sensor");

sensor.read(11, 4, function(err, temperature, humidity) {
  () =>{if (!err) {
    console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
  }
}},3000);