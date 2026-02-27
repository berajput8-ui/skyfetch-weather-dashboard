const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageDiv = document.getElementById("message");

const API_KEY = "d853889fe74cf674f550d400bde1697d";

async function getWeather(city) {
    try {
        showLoading();
        searchBtn.disabled = true;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = response.data;

        messageDiv.innerHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
        `;

    } catch (error) {
        showError("City not found. Please try again.");
    } finally {
        searchBtn.disabled = false;
    }
}

function showError(message) {
    messageDiv.innerHTML = `<p class="error">${message}</p>`;
}

function showLoading() {
    messageDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
}

/* Search Button Click */
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

/* Enter Key Support */
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

/* Initial Message */
messageDiv.innerHTML = `<p>Search for a city to see the weather.</p>`;