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
        temperature: 0,
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
                Make it sound like a live broadcast!`,
      inputVariables: ["location", "day1", "day2", "day3", "day4", "day5"],
    });

    const formattedData = {
      location: weatherData.city,
      day1: `High of ${weatherData.forecast[0].tempF} degrees, ${weatherData.forecast[0].iconDescription}`,
      day2: `High of ${weatherData.forecast[1].tempF} degrees, ${weatherData.forecast[1].iconDescription}`,
      day3: `High of ${weatherData.forecast[2].tempF} degrees, ${weatherData.forecast[2].iconDescription}`,
      day4: `High of ${weatherData.forecast[3].tempF} degrees, ${weatherData.forecast[3].iconDescription}`,
      day5: `High of ${weatherData.forecast[4].tempF} degrees, ${weatherData.forecast[4].iconDescription}`,
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
