var form = document.querySelector("#form");
var searchCity = document.querySelector("#searchCity");
var searchResults = document.querySelector("#searchResults");
var fiveDayForecast = document.querySelector("#fiveDayForecast");
var cityArray = [];
form.addEventListener("submit", function (event) {
    event.preventDefault();
    var weatherAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity.value + "&units=imperial&appid=d87a354ef5592a59d3994382f76cd854";
    fetch(weatherAPIURL)
        .then(function (response1) {
            if (response1.status === 404) {
                alert("Cannot find " + searchCity.value);
                return;
            } else if (response1.status === 400) {
                alert("You did not enter any!");
                return;
            }
            return response1.json();
        })
        .then(function (weatherAPIURLdataObj) {
            console.log(weatherAPIURLdataObj);
            printWeatherForecastToday(weatherAPIURLdataObj);
        });
})
var printWeatherForecastToday = function (results) {
    searchResults.innerHTML = "";
    fiveDayForecast.innerHTML = "";
    searchResults.innerHTML = "CITY";
    fiveDayForecast.innerHTML = "5-DAY FORECAST";
    cityMainWeatherEl = document.createElement("h3");
    cityMainWeatherElIcon = document.createElement("img");
    cityMainTempEl = document.createElement("p");
    cityMainHumidEl = document.createElement("p");
    cityMainWindSpdEl = document.createElement("p");
    cityMainWeatherEl.textContent = results.name + " (" + (moment.unix(results.dt).format("MMM DD YYYY")) + ")";
    cityMainWeatherElIcon.src = "http://openweathermap.org/img/wn/" + results.weather[0].icon + "@2x.png";
    cityMainWeatherElIcon.width, cityMainWeatherElIcon.height = "45";
    cityMainTempEl.textContent = "Temperature: " + results.main.temp + " °F";
    cityMainHumidEl.textContent = "Humidity " + results.main.humidity + " %";
    cityMainWindSpdEl.textContent = "Wind Speed: " + results.wind.speed + " MPH";
    searchResults.appendChild(cityMainWeatherEl); cityMainWeatherEl.appendChild(cityMainWeatherElIcon);
    searchResults.appendChild(cityMainTempEl);
    searchResults.appendChild(cityMainHumidEl);
    searchResults.appendChild(cityMainWindSpdEl);
    weatherForecast5Day(results.coord.lat, results.coord.lon);
    checkLocalStorage();
    displaySavedCities();
}
function weatherForecast5Day(cityLat, cityLon) {
    var oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon="
        + cityLon + "&appid=d87a354ef5592a59d3994382f76cd854";
    fetch(oneCallAPI)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (forecast5DayObj) {
            console.log(forecast5DayObj);
            printWeatherForecast5Day(forecast5DayObj);
        });
}
var printWeatherForecast5Day = function (results) {
    cityMainUV = document.createElement("p");
    cityMainUV.textContent = "UV Index: " + results.current.uvi;
    searchResults.appendChild(cityMainUV);
    dayForecastData = results.daily;
    fiveDayForecastHeader = document.createElement("div");
    for (var i = 1; i <= 5; i++) {
        eachDayForecastDiv = document.createElement("div");
        eachDayForecastDiv.classList.add("d-flex", "eachDayForecast", "p-1", "m-1");
        date = document.createElement("p");
        dayWeatherIcon = document.createElement("img");
        dayWeatherTemp = document.createElement("p");
        dayWeatherHumid = document.createElement("p");
        dayWeatherWind = document.createElement("p");
        dayWeatherUVIndex = document.createElement("p");
        date.textContent = (moment.unix(results.daily[i].dt).format("MMM DD YYYY"));
        dayWeatherIcon.src = "http://openweathermap.org/img/wn/" + results.daily[i].weather[0].icon + "@2x.png";
        dayWeatherIcon.width, dayWeatherIcon.height = "30";
        dayWeatherTemp.textContent = "Temperature: " + results.daily[i].temp.day + " °F";
        dayWeatherHumid.textContent = "Humidity " + results.daily[i].humidity + " %";
        dayWeatherWind.textContent = "Wind Speed: " + results.daily[i].wind_speed + " MPH";
        dayWeatherUVIndex.textContent = "UV Index: " + results.daily[i].uvi;
        fiveDayForecast.appendChild(eachDayForecastDiv);
        eachDayForecastDiv.appendChild(date);
        eachDayForecastDiv.appendChild(dayWeatherIcon);
        eachDayForecastDiv.appendChild(dayWeatherTemp);
        eachDayForecastDiv.appendChild(dayWeatherHumid);
        eachDayForecastDiv.appendChild(dayWeatherWind);
        eachDayForecastDiv.appendChild(dayWeatherUVIndex);
    }
}
function displaySavedCities() {
    var savedCity = document.querySelector("#savedCity");
    savedCity.innerHTML = "";
    console.log(localStorage.getItem("SavedCity"));
    var savedCityStorage = JSON.parse(localStorage.getItem("SavedCity"));
    for (var i = 0; i < savedCityStorage.length; i++) {
        savedCityDiv = document.createElement("div");
        savedCityDiv.classList.add("flex", "customBG2", "SavedCity");
        savedCityText = document.createElement("p");
        savedCityText.classList.add("text-center");
        savedCityText.textContent = savedCityStorage[i];
        savedCity.appendChild(savedCityDiv);
        savedCityDiv.appendChild(savedCityText);
    }
}
function checkLocalStorage() {
    if (localStorage.getItem("SavedCity") !== null) {
        cityArray = JSON.parse(localStorage.getItem("SavedCity"));
        if (!cityArray.includes(searchCity.value)) {
            cityArray.push(searchCity.value);
            window.localStorage.setItem("SavedCity", JSON.stringify(cityArray) );
        }
    }
    else {
        cityArray.push(searchCity.value);
        window.localStorage.setItem("SavedCity", JSON.stringify(cityArray) );
    }
}
$(".SavedCity").click(function () {
    alert("Clicked!");
});
function clearContentTextArea(element) {
    element.value = "";
}
displaySavedCities();