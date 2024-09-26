# Game Planning - Sports Weather Announcer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-16.14.0-green?logo=node.js)
![OpenWeather API](https://img.shields.io/badge/OpenWeather_API-00688B?logo=openweathermap)
![OpenAI API](https://img.shields.io/badge/OpenAI_API-412991?logo=openai)
![Typescript](https://img.shields.io/badge/Typescript-4.7.2-blue?logo=typescript)
![Langchain](https://img.shields.io/badge/Langchain-FF5733?logo=langchain)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express)
![Inquirer.js](https://img.shields.io/badge/Inquirer.js-ff69b4?logo=npm)

## Table of Contents

- [Game Planning - Sports Weather Announcer](#game-planning---sports-weather-announcer)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Installation Instructions](#installation-instructions)
  - [Usage Instructions](#usage-instructions)
  - [Contributing Guidelines](#contributing-guidelines)
  - [License Information](#license-information)
  - [Acknowledgments](#acknowledgments)
  - [Questions](#questions)
  - [Resources](#resources)

## Description

The **Game Planning - Sports Weather Announcer** is a web application that combines data from the OpenWeather API with OpenAI's API to produce a 5-day weather forecast, delivered in the style of a baseball radio announcer. It provides a fun and engaging way to present weather information, making it perfect for use in game planning scenarios where weather plays a role in outdoor activities.

To begin the project I cloned my previous Weather API app, available here: [BACK-END-WEATHER-API](https://github.com/savevsgames/BackEnd-WeatherAPI)

I maintained the project structure and added some minor css (to add to the baseball theme) and routing for the OpenAI API to recieve the weather data for a city that a user searches for and return the formatted 'Announcer Forecast' to be appended to the page when it completes.

## Installation Instructions

To install the **Game Planning - Sports Weather Announcer**, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/Game-Planning-Sports-Weather-Announcer.git
   ```

2. Navigate to the project directory:

```bash
   cd Game-Planning-Sports-Weather-Announcer
```

3. Install the required dependencies:

```bash
   npm install
```

## Usage Instructions

To use the **Game Planning - Sports Weather Announcer**:

1. Ensure that you have your OpenWeather and OpenAI API keys ready.
2. Run the application:

   ```bash
   node server.js
   ```

3. Open your browser and navigate to `http://localhost:3001` to interact with the app.
4. Enter the name of a city, and the app will:
   - Fetch the 5-day weather forecast for that city using the OpenWeather API.
   - Send the weather data to OpenAI, which will return a playful, baseball announcer-style weather report.
5. The generated weather forecast will be displayed on the page.

## Contributing Guidelines

Contributions to the **Game Planning - Sports Weather Announcer** are welcome! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request with a detailed description of your changes.

## License Information

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

I would like to thank the following resources and communities for their contributions to this project:

- **OpenWeather API**: For providing reliable weather data that powers this application.
- **OpenAI API**: For generating the fun, announcer-style weather forecasts that give this project its unique charm.
- **Node.js**: For providing the runtime that powers the backend of this application.
- **Express.js**: For simplifying the setup of the server that handles API requests and routing.
- **Inquirer.js**: For helping simplify CLI prompts in the development process.
- **Langchain**: For easing the use of language models in this project.

## Questions

For any questions, issues, or support, feel free to contact me via:

- **GitHub Profile**: [savevsgames](https://github.com/savevsgames)
- **Email**: [gregcbarker@gmail.com](mailto:gregcbarker@gmail.com)

## Resources

- [OpenWeather API Documentation](https://openweathermap.org/api)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Langchain Documentation](https://docs.langchain.com/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Inquirer.js Documentation](https://www.npmjs.com/package/inquirer)
- [Node.js Documentation](https://nodejs.org/)
- [Typescript Documentation](https://www.typescriptlang.org/)
