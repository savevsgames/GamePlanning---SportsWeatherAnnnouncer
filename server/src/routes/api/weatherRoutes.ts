import { Router } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";
import { City } from "../../service/historyService.js";

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req, res) => {
  // TODO: GET weather data from city name
  let initialCity;
  // check if any cities exists in searchHistory
  const cities = await HistoryService.getCities();
  if (cities.length === 0) {
    console.log("No cities in search history");
    initialCity = "Toronto"; // default city
  } else {
    console.log("Cities in search history:", cities);
    initialCity = cities[0].name;
  }

  try {
    const cityName = req.body.cityName || initialCity;
    console.log("City name being searched for:", cityName);
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // NO WEATHER DATA FOUND
    if (!weatherData) {
      return res.status(404).json({ message: "City not found" });
    }
    // WEATHER DATA FOUND
    // console.log("Weather data found successfully: ", weatherData);
    // console.log("Current weather data: ", weatherData.currentWeather);
    // console.log("Forecast data: ", weatherData.forecast);
    // console.log("Greg's Weather Data Name: ", weatherData.currentWeather.city);

    // Prepare the currentWeather object to send back to the client
    const currentWeather = {
      city: weatherData.currentWeather.city,
      date: weatherData.currentWeather.date,
      icon: weatherData.currentWeather.icon,
      iconDescription: weatherData.currentWeather.iconDescription,
      tempF: weatherData.currentWeather.tempF,
      windSpeed: weatherData.currentWeather.windSpeed,
      humidity: weatherData.currentWeather.humidity,
    };

    // Prepare the forecast array to send back to the client
    const forecastData = weatherData.forecast.map((forecast: any) => ({
      date: forecast.date,
      icon: forecast.icon,
      iconDescription: forecast.iconDescription,
      tempF: forecast.tempF,
      windSpeed: forecast.windSpeed,
      humidity: forecast.humidity,
    }));
    let coordinateData;
    try {
      coordinateData = await WeatherService.fetchLocationData(cityName);
      console.log("Coordinates for the fetch request:", coordinateData);
    } catch (error) {
      console.error("Error fetching location data:", error);
      coordinateData = { lat: 0, lon: 0 };
    }
    // TODO: save city to search history
    // Check if the city is already in the search history
    const cityExists = cities.some((city: City) => city.name === cityName);
    if (!cityExists) {
      await HistoryService.addCity(
        req.body.cityName,
        coordinateData.lat,
        coordinateData.lon
      );
      console.log("City added to search history");
      // Send the currentWeather and forecastData back to the client
      return res.json([currentWeather, ...forecastData]);
    } else {
      console.log("City already exists in search history");
      return res.json([currentWeather, ...forecastData]);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error. The city could not be found." });
  }
});

// TODO: GET search history
router.get("/history", async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    console.log("Cities to return", cities);
    return res.json(cities);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error. Error retrieving cities." });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req, res) => {
  try {
    await HistoryService.removeCity(req.params.id);
    return res.json({ message: "City removed from search history" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error. Error removing city." });
  }
});

export default router;
