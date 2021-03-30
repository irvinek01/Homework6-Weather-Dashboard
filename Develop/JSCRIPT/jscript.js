var form = document.querySelector("#form");
var searchCity = document.querySelector("#searchCity");
var searchResults = document.querySelector("#searchResults");
var fiveDayForecast = document.querySelector("#fiveDayForecast");
var savedCityClick = document.querySelector("#savedCity");
var cityArray = []; // Empty Array for Localstorage
savedCityClick.addEventListener("click", function (event) { // Saved Cities on the left part, onclick
    element = event.target;
    fetchDataAPI(element.textContent); // Gets element text value to pass on fetchDataAPI function
})
form.addEventListener("submit", function (event) { // Search City on upper left part, handles submit
    event.preventDefault();
    fetchDataAPI(searchCity.value); // Gets element textbox value to pass on fetchDataAPI function
})
function fetchDataAPI(cityName) { // All values received will be named as city name in this function
    var weatherAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=d87a354ef5592a59d3994382f76cd854";
    fetch(weatherAPIURL)
        .then(function (response1) {
            if (response1.status === 404) {
                alert("Cannot find " + cityName);
                return;
            } else if (response1.status === 400) {
                alert("You did not enter any!");
                return;
            }
            return response1.json();
        })
        .then(function (weatherAPIURLdataObj) {
            printWeatherForecastToday(weatherAPIURLdataObj);
        });
}
var printWeatherForecastToday = function (results) {
    searchResults.innerHTML = "";
    fiveDayForecast.innerHTML = "";
    searchResults.innerHTML = "CITY - WEATHER NOW";
    fiveDayForecast.innerHTML = "5DAY FORECAST";
    cityMainWeatherEl = document.createElement("h3"); // All elements under "CITY - WEATHER NOW" except UV Index
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
    weatherForecast5Day(results.coord.lat, results.coord.lon); // Passes lat and lon of the city above to the next function
    checkLocalStorage();
    displaySavedCities();
}
function weatherForecast5Day(cityLat, cityLon) { // For the onecall API
    var oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon="
        + cityLon + "&units=imperial&appid=d87a354ef5592a59d3994382f76cd854";
    fetch(oneCallAPI)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (forecast5DayObj) {
            printWeatherForecast5Day(forecast5DayObj);
        });
}
var printWeatherForecast5Day = function (results) { // Handles the 5 Day-forecast and the UV Index
    cityMainUV = document.createElement("span");
    cityMainUV.textContent = "UV Index: " + results.current.uvi;
    if (results.current.uvi < 2) {
        cityMainUV.setAttribute("class", "uvlow");
    } else if (results.current.uvi < 5) {
        cityMainUV.setAttribute("class", "uvmed");
    } else if (results.current.uvi < 7) {
        cityMainUV.setAttribute("class", "uvhigh");
    } else if (results.current.uvi < 10) {
        cityMainUV.setAttribute("class", "uvveryhigh");
    } else {
        cityMainUV.setAttribute("class", "uvtoohigh");
    }
    searchResults.appendChild(cityMainUV);
    fiveDayForecastHeader = document.createElement("div");
    for (var i = 1; i <= 5; i++) { // Starts on the day after CITY WEATHER NOW, ends at the 5th day
        eachDayForecastDiv = document.createElement("div");
        eachDayForecastDiv.classList.add("d-flex", "eachDayForecast", "p-1", "m-1", "roundCorners", "align-items-center","flex-wrap", "col-xl-2",
            "customBG", "justify-content-center");
        date = document.createElement("p");
        dayWeatherIcon = document.createElement("img");
        dayWeatherTemp = document.createElement("p");
        dayWeatherHumid = document.createElement("p");
        dayWeatherWind = document.createElement("p");
        dayWeatherUVIndex = document.createElement("p");
        date.textContent = (moment.unix(results.daily[i].dt).format("MMM DD YYYY"));
        dayWeatherIcon.src = "http://openweathermap.org/img/wn/" + results.daily[i].weather[0].icon + "@2x.png";
        dayWeatherIcon.width, dayWeatherIcon.height = "35";
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
function checkLocalStorage() { // Checks if the array is not empty, checks again if the textbox value is not in the array
    if (localStorage.getItem("SavedCity") !== null) {
        cityArray = JSON.parse(localStorage.getItem("SavedCity"));
        if (!cityArray.includes(searchCity.value)) {
            cityArray.push(searchCity.value);
            window.localStorage.setItem("SavedCity", JSON.stringify(cityArray));
        }
    }
    else {
        cityArray.push(searchCity.value);
        window.localStorage.setItem("SavedCity", JSON.stringify(cityArray));
    }
}
function displaySavedCities() { // Display saved cities from array
    var savedCity = document.querySelector("#savedCity");
    savedCity.innerHTML = "";
    savedCity.innerHTML = "Saved Cities";
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
function clearContentTextArea(element) { // textbox onclick clears it
    element.value = "";
}
displaySavedCities();