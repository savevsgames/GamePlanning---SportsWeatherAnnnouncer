import express from "express";
import dotenv from "dotenv";
// import type { Request, Response } from "express";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
// import { z } from "zod";
// import { StructuredOutputParser, OutputFixingParser } from "@langchain/core/output_parsers";
// import type { Weather } from "../service/weatherService";

// Load environment variables
dotenv.config();
// API key for OpenAI
const apiKey = process.env.OPENAI_API_KEY;

// initialize express app and middleware
const app = express();
app.use(express.json());

// Initialize the OpenAI model in the AnnouncerService class
class AnnouncerController {
  private model: OpenAI;

  constructor() {
    // Check if the API key is defined
    // If the key is valid then construct the OpenAI model
    if (apiKey) {
      this.model = new OpenAI({
        openAIApiKey: apiKey,
        modelName: "gpt-3.5-turbo",
        temperature: 0.5,
        maxTokens: 2000,
      });
    } else {
      // If the key is not defined then throw an error instead of logging it because it will be caught in the catch block
      throw new Error("OPENAI_API_KEY is not defined.");
    }
  }

  // Function to create the prompt using the weather data
  private async createPrompt(weatherData: any): Promise<string> {
    const template = new PromptTemplate({
      template: `You are a sports radio announcer, providing a 5-day weather forecast for the location {location}. Here's the weather breakdown for the next 5 days:\n
                Day 1: {day1}\n
                Day 2: {day2}\n
                Day 3: {day3}\n
                Day 4: {day4}\n
                Day 5: {day5}\n
                Make it sound like a live broadcast! Be sure to use the date instead of "Day 1", "Day 2", etc. and taking all the weather data into account, decide if it will be a good day for a baseball game or if there will be a game delay and give the forecast from the point of view of a baseball radio announcer. You do not have to directly reference the data values - but rather, use them to inform your broadcast. Example for a Day with cloudy skies but still good weather: Starting off with day1, we're looking at some cloudy skies with a high of 75 degrees and a light breeze. A few clouds wont stop us though, it's a great day for baseball!`,
      inputVariables: ["location", "day1", "day2", "day3", "day4", "day5"],
    });

    const formattedData = {
      location: weatherData.currentWeather.city,
      day1: `${weatherData.forecast[0].date} - High of ${
        weatherData.forecast[0].tempF
      } degrees, ${weatherData.forecast[0].iconDescription} ${Math.round(
        weatherData.forecast[0].windSpeed * 2.23694
      )} mph wind speed, ${weatherData.forecast[0].humidity}% humidity`,
      day2: `${weatherData.forecast[1].date} - High of ${
        weatherData.forecast[1].tempF
      } degrees, ${weatherData.forecast[1].iconDescription} ${Math.round(
        weatherData.forecast[1].windSpeed * 2.23694
      )} mph wind speed, ${weatherData.forecast[1].humidity}% humidity`,
      day3: `${weatherData.forecast[2].date} - High of ${
        weatherData.forecast[2].tempF
      } degrees, ${weatherData.forecast[2].iconDescription} ${Math.round(
        weatherData.forecast[2].windSpeed * 2.23694
      )} mph wind speed, ${weatherData.forecast[2].humidity}% humidity`,
      day4: `${weatherData.forecast[3].date} - High of ${
        weatherData.forecast[3].tempF
      } degrees, ${weatherData.forecast[3].iconDescription} ${Math.round(
        weatherData.forecast[3].windSpeed * 2.23694
      )} mph wind speed, ${weatherData.forecast[3].humidity}% humidity`,
      day5: `${weatherData.forecast[4].date} - High of ${
        weatherData.forecast[4].tempF
      } degrees, ${weatherData.forecast[4].iconDescription} ${Math.round(
        weatherData.forecast[4].windSpeed * 2.23694
      )} mph wind speed, ${weatherData.forecast[4].humidity}% humidity`,
    };

    return template.format(formattedData);
  }

  // Create a prompt function that takes the user input and passes it through the call method
  public async announcerPromptFunction(weatherData: any): Promise<string> {
    // TODO: Format the prompt with the user input/weather data
    const prompt = await this.createPrompt(weatherData);
    // TODO: Call the model with the formatted prompt
    try {
      const result = await this.model.invoke(prompt);
      return result;

      // TODO: Catch any errors and log them to the console
    } catch (error) {
      console.error("Error:", error);
      throw new Error("OpenAI request failed.");
    }
  }
}

export default AnnouncerController;
