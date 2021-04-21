'use strict';

const superagent = require('superagent');
const express = require('express');
require('dotenv').config();
const cors = require('cors');

// const weatherData = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/weather', (request, response) => {
  superagent.get('https://api.weatherbit.io/v2.0/forecast/daily')
    .query({
      key: process.env.WEATHER_API_KEY,
      units: 'I',
      lat: request.query.lat,
      lon: request.query.lon
    })
    .then(weatherData => {
      response.json(weatherData.body.data.map(day => new DailyForecast(day)));
    })
    .catch(error => handleErrors(error, response));
});

function DailyForecast(day) {
  this.date = day.datetime;
  this.description = day.weather.description;
}

function handleErrors (error, response) {
  response.status(500).send('Internal Error');
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
