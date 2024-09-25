import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// ParsedWeather interface
export interface ParsedWeather {
  city: string;
  date: string;
  dt: number;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
}

// TODO: Define a class for the Weather object
export class Weather {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  snow?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    message?: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;

  constructor(data: any) {
    this.coord = data.coord;
    this.weather = data.weather;
    this.base = data.base;
    this.main = data.main;
    this.visibility = data.visibility;
    this.wind = data.wind;
    this.clouds = data.clouds;
    this.rain = data.rain;
    this.snow = data.snow;
    this.dt = data.dt;
    this.sys = data.sys;
    this.timezone = data.timezone;
    this.id = data.id;
    this.name = data.name;
    this.cod = data.cod;
  }
} // Based on the OpenWeatherMap API response

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private baseURLGeo: string;
  private apiKey: string;
  private cityName: string;

  constructor(
    baseURL = "https://api.openweathermap.org/data/2.5",
    baseURLGeo = "https://api.openweathermap.org/geo/1.0/direct",
    apiKey = process.env.WEATHER_API_KEY || "",
    cityName = "Toronto"
  ) {
    this.baseURL = baseURL;
    this.baseURLGeo = baseURLGeo;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  // Fetch location data based on the city name or default city
  public async fetchLocationData(city?: string): Promise<Coordinates> {
    const cityName = city || this.cityName; // Use default if no city provided
    const geocodeQuery = this.buildGeocodeQuery(cityName);
    console.log("Geocode query:", geocodeQuery);

    try {
      const response = await fetch(geocodeQuery);
      // console.log("Response from fetch request:", response);

      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }

      const locationData = await response.json();
      // console.log("Location data from fetch request:", locationData);

      if (!locationData || locationData.length === 0) {
        throw new Error("No location data found for the specified city.");
      }

      return this.destructureLocationData(locationData[0]);
    } catch (error) {
      console.error("Fetch location error:", error);
      throw new Error("Unable to fetch location data.");
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    const geocodeQuery = `${this.baseURLGeo}?q=${query}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    return weatherQuery;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // Create fetchWeatherData method for both current weather and forecast
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates); // For current weather
    const forecastQuery = `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`; // For 5-day forecast

    try {
      // Fetch current weather
      const weatherResponse = await fetch(weatherQuery);
      const currentWeather = await weatherResponse.json();
      console.log("Current weather data:", currentWeather);

      // Fetch forecast data
      const forecastResponse = await fetch(forecastQuery);
      const forecastData = await forecastResponse.json();

      // Build the forecast array
      const forecastArray = this.buildForecastArray(forecastData.list); // 'list' is the array containing forecast data

      return { currentWeather, forecastArray };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Unable to fetch weather data.");
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(data: any): ParsedWeather {
    return {
      city: data.name, // The city name
      date: new Date(data.dt * 1000).toLocaleDateString(), // Convert UNIX timestamp to a readable date
      dt: data.dt,
      tempF: data.main.temp, // Convert temperature from Celsius to Fahrenheit
      windSpeed: data.wind.speed, // Wind speed in mph or m/s, depending on API settings
      humidity: data.main.humidity, // Humidity percentage
      icon: data.weather[0].icon, // Weather icon code
      iconDescription: data.weather[0].description, // Description of the weather (e.g., "clear sky")
    };
  }

  // TODO: Complete buildForecastArray method
  // Build a forecast array for the 5-day forecast (daily)
  private buildForecastArray(forecastData: any[]): any[] {
    // Group forecast data into daily intervals
    const dailyForecast: any[] = [];

    // OpenWeather returns forecast data in 3-hour intervals, so we can filter for 1 forecast per day (e.g., midday).
    // You can customize this filtering logic as needed.
    forecastData.forEach((dataPoint: any) => {
      const nonISODate = new Date(dataPoint.dt * 1000); // Convert UNIX timestamp to JavaScript Date
      const hours = nonISODate.getUTCHours(); // Get hours (we can filter by hours)
      const date = nonISODate.toDateString(); // Get the date
      // Assume we take the forecast at midday (6 PM)
      if (hours === 18) {
        // console.log("Date:", date, "Hours:", hours);
        dailyForecast.push({
          date: date, // Format as a readable date
          icon: dataPoint.weather[0].icon, // Weather icon code
          iconDescription: dataPoint.weather[0].description, // Icon description
          tempF: Math.round((dataPoint.main.temp * 9) / 5 + 32), // Convert temperature to Fahrenheit
          windSpeed: dataPoint.wind.speed, // Wind speed
          humidity: dataPoint.main.humidity, // Humidity
        });
      }
    });

    return dailyForecast;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchLocationData(city);
      console.log("Coordinates for the fetch request:", coordinates);

      // Fetch both current weather and forecast
      const { currentWeather, forecastArray } = await this.fetchWeatherData(
        coordinates
      );

      return {
        currentWeather: this.parseCurrentWeather(currentWeather), // Parse current weather
        forecast: forecastArray, // Already structured by buildForecastArray
      };
    } catch (error) {
      console.error("Error in getWeatherForCity:", error);
      throw new Error("Unable to get weather for the specified city.");
    }
  }
}

export default new WeatherService();
