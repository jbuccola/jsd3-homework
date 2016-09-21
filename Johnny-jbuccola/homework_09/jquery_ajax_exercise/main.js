/*

- Sign up for openweathermap.org and generate an API key.
- User either $.ajax or $.get to pull weather current data .
  for San Francisco (hint: http://api.openweathermap.org/data/2.5/weather?q=...).
- Print the temperature in console.
- Bonus 1: add a form prompting user for the city and state.
- Bonus 2: convert answer from kelvin to fahrenheit.

API call:

api.openweathermap.org/data/2.5/weather?q={city name}

api.openweathermap.org/data/2.5/weather?q={city name},{country code}

Temperature is available in Fahrenheit, Celsius and Kelvin units.

For temperature in Fahrenheit use units=imperial

*/

'use strict';

var apiKey = "3f598bbe956e175dc184d9dbdf5c9855";
var cityName = prompt("Enter a City Name:");
var countryCode = prompt("Enter a country code, e.g. 'UK', 'US', etc.")
var weatherUrl = "https://accesscontrolalloworiginall.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&APPID="+apiKey;

$.get((weatherUrl + apiKey), function(resp) {
  console.log(resp);
})