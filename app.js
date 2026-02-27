function WeatherApp() {
  this.apiKey = "d853889fe74cf674f550d400bde1697d";
  this.baseUrl = "https://api.openweathermap.org/data/2.5/";

  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.weatherDisplay = document.getElementById("weatherDisplay");
  this.forecastContainer = document.getElementById("forecastContainer");

  this.recentContainer = document.getElementById("recentContainer");
  this.clearHistoryBtn = document.getElementById("clearHistory");

  this.recentSearches = [];
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", () => {
    const city = this.cityInput.value.trim();
    if (city) this.getWeather(city);
  });

  this.loadRecentSearches();
  this.loadLastCity();

  this.clearHistoryBtn.addEventListener(
    "click",
    this.clearHistory.bind(this)
  );
};

WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.weatherDisplay.innerHTML = "Loading...";

    const weatherResponse = await fetch(
      `${this.baseUrl}weather?q=${city}&units=metric&appid=${this.apiKey}`
    );

    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      this.weatherDisplay.innerHTML = "City not found.";
      return;
    }

    const forecastResponse = await fetch(
      `${this.baseUrl}forecast?q=${city}&units=metric&appid=${this.apiKey}`
    );

    const forecastData = await forecastResponse.json();

    this.displayWeather(weatherData);
    this.displayForecast(forecastData);

    this.saveRecentSearch(city);

  } catch (error) {
    this.weatherDisplay.innerHTML = "Something went wrong.";
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  `;
};

WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString()}</p>
      <p>${day.main.temp}°C</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
    `;

    this.forecastContainer.appendChild(card);
  });
};

WeatherApp.prototype.loadRecentSearches = function () {
  const stored = localStorage.getItem("recentSearches");
  if (stored) {
    this.recentSearches = JSON.parse(stored);
    this.displayRecentSearches();
  }
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city =
    city.charAt(0).toUpperCase() +
    city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(
    item => item !== city
  );

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(this.recentSearches)
  );

  localStorage.setItem("lastCity", city);

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentContainer.innerHTML = "";

  this.recentSearches.forEach(function (city) {
    const btn = document.createElement("button");
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentContainer.appendChild(btn);
  }.bind(this));
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  localStorage.removeItem("lastCity");

  this.recentSearches = [];
  this.displayRecentSearches();
};

const app = new WeatherApp();
app.init();