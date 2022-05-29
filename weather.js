import dotenv from "dotenv";
import fetch from "node-fetch";
import { Command } from "commander";

dotenv.config();

const API_KEY = process.env.API_KEY;
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

const UNITS = {
   STANDARD: "standard",
   METRIC: "metric",
};
const SCALES = {
   CELSIUS: "c",
   FAHRENHEIT: "f",
};

function convertScaleToUnits(scale) {
   switch (scale) {
      case SCALES.CELSIUS: {
         return UNITS.METRIC;
      }
      case SCALES.FAHRENHEIT: {
         return UNITS.STANDARD;
      }
      default: {
         return UNITS.METRIC;
      }
   }
}
async function apiGet(cityName, units) {
   const params = new URLSearchParams({
      q: cityName,
      units,
      appid: API_KEY,
   }).toString();

   const response = await fetch(`${WEATHER_API_BASE_URL}${params}`);
   const data = await response.json();
   return data;
}

const program = new Command();

program
   .name("Temperature Logger")
   .description("Get the current temperature in a city of your choosing")
   .version("1.0.0");

program
   .command("get-temp")
   .description("Gets temperature")
   .argument("<string>", "City name")
   .option(
      "-s, --scale <string>",
      "Temperature scale - either c for celsius or f for fahrenheit",
      SCALES.CELSIUS
   )
   .action(async (cityName, options) => {
      const units = convertScaleToUnits(options.scale);
      const data = await apiGet(cityName, units);
      console.log(`It's ${data.main.temp} degrees in ${cityName}`);
   });

program
   .command("get-detailed-forecast")
   .description("Displays in depth information about today's weather forecast")
   .argument("<string>", "City name")
   .option(
      "-s, --scale <string>",
      "Temperature scale - either c for celsius or f for fahrenheit",
      SCALES.CELSIUS
   )
   .action(async (cityName, options) => {
      const units = convertScaleToUnits(options.scale);
      const weatherData = await apiGet(cityName, units);
      console.log(weatherData);
      const { description: weatherDescription } = weatherData.weather[0];
      const { temp_min: minTemp, temp_max: maxTemp } = weatherData.main;
      const { speed: windSpeed } = weatherData.wind;

      console.log(
         `Today we will have ${weatherDescription}, temperatures will range from ${minTemp} to ${maxTemp} degrees with a wind speed of ${windSpeed}`
      );
   });

program.parse();
