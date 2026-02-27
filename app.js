function WeatherApp() {
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.messageDiv = document.getElementById("message");

    this.API_KEY = "d853889fe74cf674f550d400bde1697d";
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.messageDiv.innerHTML = `<p>Search for a city to see the weather forecast.</p>`;
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();
        this.searchBtn.disabled = true;

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;

        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(weatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherResponse.data);
        const processedForecast = this.processForecastData(forecastResponse.data.list);
        this.displayForecast(processedForecast);

    } catch (error) {
        this.showError("City not found. Please try again.");
    } finally {
        this.searchBtn.disabled = false;
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.messageDiv.innerHTML = `
        <div class="current-weather">
            <h2>${data.name}</h2>
            <p><strong>${data.main.temp}°C</strong></p>
            <p>${data.weather[0].description}</p>
        </div>
        <div id="forecastContainer" class="forecast-container"></div>
    `;
};

WeatherApp.prototype.processForecastData = function (forecastList) {
    const dailyData = forecastList.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyData.slice(0, 5);
};

WeatherApp.prototype.displayForecast = function (forecastData) {
    const container = document.getElementById("forecastContainer");

    forecastData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        container.innerHTML += `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });
};

WeatherApp.prototype.showLoading = function () {
    this.messageDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
};

WeatherApp.prototype.showError = function (message) {
    this.messageDiv.innerHTML = `<p class="error">${message}</p>`;
};

const app = new WeatherApp();
app.init();