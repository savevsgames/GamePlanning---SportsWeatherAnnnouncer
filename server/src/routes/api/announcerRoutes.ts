import express from "express";
import AnnouncerController from "../../controller/announcerController.js";
import WeatherService from "../../service/weatherService.js";

const router = express.Router();

const announcerController = new AnnouncerController();

router.post("/", async (req, res) => {
  try {
    console.log("Request received for announcer forecast.");
    const cityName = req.body.cityName || "Toronto";
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    if (!weatherData) {
      return res.status(404).json({ message: "City not found" });
    }
    console.log("Weather data found successfully: ", weatherData);
    console.log("Sending data to OpenAI API...");
    const announcerForecastData =
      await announcerController.announcerPromptFunction(weatherData);
    console.log("Announcer forecast data:", announcerForecastData);
    // Prepare the currentWeather object to send back to the client
    return res.json({ forecast: announcerForecastData });
  } catch (error) {
    console.error("Error fetching OpenAI API data:", error);
    return res
      .status(500)
      .json({ message: "Unable to retrieve announcer forecast." });
  }
});

export default router;
