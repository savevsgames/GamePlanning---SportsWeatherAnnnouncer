import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// TODO: Define a City class with name and id properties
// The city should also have optional lat and lon properties for future convenience
// This is because the API query prefers the city's latitude and longitude to its name
export class City {
  name: string;
  id: string;
  lat?: number;
  lon?: number;
  constructor(name: string, id: string, lat?: number, lon?: number) {
    this.name = name;
    this.id = id;
    this.lat = lat !== undefined ? lat : 0;
    this.lon = lon !== undefined ? lon : 0;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<string> {
    try {
      const fileData = await fs.promises.readFile(
        "./db/searchHistory.json",
        "utf8"
      );
      console.log("File data:", fileData);
      return fileData;
    } catch (error) {
      console.error("Error reading from cities array file:", error);
      return "[]"; // Return an empty array if there is an error
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.promises.writeFile(
        "./db/searchHistory.json",
        JSON.stringify(cities, null, 2)
      );
    } catch (error) {
      console.error("Error writing to cities array file:", error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    const cities = data !== null ? JSON.parse(data) : [];
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // giving the city a unique id will allow us to remove it later
  async addCity(cityName: string, lat: number, lon: number) {
    const cities = await this.getCities();
    const id = uuidv4();
    const newCity = new City(cityName, id, lat, lon);
    cities.push(newCity);
    await this.write(cities);
    console.log(cityName, "City added to search history!");
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city: City) => city.id !== id);
    this.write(updatedCities);
  }
}

export default new HistoryService();
