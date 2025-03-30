const express = require('express');
const sensorRoute = require('./routes/sensorRoute');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/sensors', sensorRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
