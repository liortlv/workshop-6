// 6. Create a basic commander skeleton without the actions implementation (just the metadata and commands configuration).
// 7. Implement the first command, including the optional arguments.
// 8. BONUS - Implement the second command.

// Commander usage example for your reference:
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Command } from "commander";

dotenv.config();

const API_KEY = process.env.API_KEY;

const program = new Command();

async function apiGet(cityName) {
   const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
   );
   const data = await response.json();
   return data;
}

program
   .name("Temperature Logger")
   .description("Get the current temperature in a city of your choosing")
   .version("1.0.0");

program
   .command("get-temp")
   .description("Gets temperature")
   .argument("<city-name>", "city name")
   .option("-s, --scale <string>", "Celsius or Ferhanite", "c")
   .action(async (cityName, options) => {
      const data = await apiGet(cityName);
      if (option.scale === 1) {
         console.log("TEST");
      }
      console.log(`It's ${data.main.temp} degrees in ${cityName}`);
   });

program.parse();
