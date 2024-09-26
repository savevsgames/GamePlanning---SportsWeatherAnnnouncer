import "./styles/jass.css";

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  "search-form"
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  "search-input"
) as HTMLInputElement;
const todayContainer = document.querySelector("#today") as HTMLDivElement;
const forecastContainer = document.querySelector("#forecast") as HTMLDivElement;
const announcerContainer = document.querySelector(
  "#announcer"
) as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  "history"
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  "search-title"
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  "weather-img"
) as HTMLImageElement;

/*
 DOM Conent Loaded = If there is a search history, render it
*/

document.addEventListener("DOMContentLoaded", async () => {
  const history = await fetchSearchHistory();
  const historyList = await history.json();

  if (historyList.length > 0) {
    // Load the most recent city in history
    const lastCity = historyList[historyList.length - 1].cityName;
    fetchWeather(lastCity);
    getAndRenderAnnouncerForecast(lastCity);
  } else {
    // No history, load default city
    fetchWeather("Toronto"); // or any default city of your choice
    getAndRenderAnnouncerForecast("Toronto");
  }
});

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  const response = await fetch("/api/weather/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cityName }),
  });

  const weatherData = await response.json();

  console.log("weatherData: ", weatherData);

  renderCurrentWeather(weatherData[0]);
  renderForecast(weatherData.slice(1));
};

const fetchSearchHistory = async () => {
  const history = await fetch("/api/weather/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return history;
};

const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// OPEN AI API CALL
const fetchAnnouncerForecast = async (cityName: string) => {
  const response = await fetch("/api/announcer/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cityName }),
  });

  const forecast = await response.json();
  return forecast;
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  const { city, icon, iconDescription } = currentWeather;

  // convert the following to typescript
  heading.textContent = `${city}`;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute("alt", iconDescription);
  weatherIcon.setAttribute("class", "weather-img");
  heading.append(weatherIcon);

  if (todayContainer) {
    todayContainer.innerHTML = "";
    todayContainer.append(heading);
  }
};

const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement("div");
  const heading = document.createElement("h4");

  headingCol.setAttribute("class", "col-12");
  heading.textContent = "5-Day Forecast:";
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = "";
    forecastContainer.append(headingCol);
  }

  for (let i = 0; i < forecast.length; i++) {
    renderForecastCard(forecast[i]);
  }
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  // Add content to elements
  cardTitle.textContent = date;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/w/${icon}.png`
  );
  weatherIcon.setAttribute("alt", iconDescription);
  tempEl.textContent = `Temp: ${tempF} °F`;
  windEl.textContent = `Wind: ${Math.round(windSpeed * 2.23694)} mph`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async (searchHistory: any) => {
  const historyList = await searchHistory.json();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = "";

    if (!historyList.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center" style="font-weight: bold; margin-left: 2rem">No Previous Search History</p>';
    }

    // * Start at end of history array and count down to show the most recent cities at the top.
    for (let i = historyList.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(historyList[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};
// Function to get and render the announcer forecast from the OpenAI API
const getAndRenderAnnouncerForecast = async (cityName: string) => {
  const forecast = await fetchAnnouncerForecast(cityName);
  console.log("forecast: ", forecast);
  createAnnouncerForecastContainer(forecast);
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement("div");
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h6");
  const weatherIcon = document.createElement("img");
  const tempEl = document.createElement("p");
  const windEl = document.createElement("p");
  const humidityEl = document.createElement("p");

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add("col-auto");
  card.classList.add(
    "forecast-card",
    "card",
    "text-white",
    "bg-primary",
    "h-100"
  );
  cardBody.classList.add("card-body", "p-2");
  cardTitle.classList.add("card-title");
  tempEl.classList.add("card-text");
  windEl.classList.add("card-text");
  humidityEl.classList.add("card-text");

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement("button");
  btn.setAttribute("type", "button");
  btn.setAttribute("aria-controls", "today forecast");
  btn.classList.add("history-btn", "btn", "btn-secondary", "col-10");
  btn.textContent = city;

  return btn;
};

const createDeleteButton = () => {
  const delBtnEl = document.createElement("button");
  delBtnEl.setAttribute("type", "button");
  delBtnEl.classList.add(
    "fas",
    "fa-trash-alt",
    "delete-city",
    "btn",
    "btn-danger",
    "col-2"
  );

  delBtnEl.addEventListener("click", handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement("div");
  div.classList.add("display-flex", "gap-2", "col-12", "m-1");
  return div;
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

// Function to create the announcer forecast container
const createAnnouncerForecastContainer = async (forecast: any) => {
  const forecastString = forecast.forecast;

  // Split the forecast string into an array of strings
  const forecastStringArray = forecastString.split("\n");
  console.log("forecastStringArray: ", forecastStringArray);

  const forecastDiv = document.createElement("div");
  forecastDiv.classList.add("forecast-div");

  const forecastTitle = document.createElement("h3");
  forecastTitle.textContent = "Announcer Forecast";
  forecastTitle.classList.add("forecast-title");
  forecastDiv.append(forecastTitle);

  let forecastTextArray = document.createElement("div");

  for (let i = 0; i < forecastStringArray.length; i++) {
    const forecastText = document.createElement("p");
    forecastText.classList.add("forecast-announcer-text");
    forecastText.textContent = forecastStringArray[i];
    forecastTextArray.append(forecastText);
  }
  forecastDiv.append(forecastTextArray);

  announcerContainer.appendChild(forecastDiv);
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error("City cannot be blank");
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });

  // Delete all content in the announcer container
  announcerContainer.innerHTML = "";
  // call the openAI API with the city name as well
  getAndRenderAnnouncerForecast(search);

  searchInput.value = "";
};

const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches(".history-btn")) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
    // Delete all content in the announcer container
    announcerContainer.innerHTML = "";
    // call the openAI API with the city name as well
    getAndRenderAnnouncerForecast(city);
  }
};

const handleDeleteHistoryClick = (event: any) => {
  event.stopPropagation();
  const cityID = JSON.parse(event.target.getAttribute("data-city")).id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () =>
  fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener("submit", handleSearchFormSubmit);
searchHistoryContainer?.addEventListener("click", handleSearchHistoryClick);

getAndRenderHistory();
