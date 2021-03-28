var form = document.querySelector("#form");
var searchCity = document.querySelector("#searchCity");
var searchResults = document.querySelector("#searchResults");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    var weatherAPIURL = "https://api.openweathermap.org/data/2.5/forecast?q=London&units=imperial&appid=d87a354ef5592a59d3994382f76cd854";
    fetch(weatherAPIURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (dataObj) {
            console.log(dataObj);
            printWeatherForecast(dataObj);
        });
})

var printWeatherForecast = function (results) {
    searchResults.innerHTML = "";

    cityMainWeatherEl = document.createElement("h2");
    cityMainTempEl = document.createElement("p");
    cityMainHumidEl = document.createElement("p");
    cityMainWindSpdEl = document.createElement("p");

    cityMainWeatherEl.textContent = results.city.name;
    cityMainTempEl.textContent = "Temperature is: " + results.list[0].main.temp;
    cityMainHumidEl.textContent = "Humidity % is: " + results.list[0].main.humidity + "%";
    cityMainWindSpdEl.textContent = "Wind Speed: " + results.list[0].wind.speed;

    

    searchResults.appendChild(cityMainWeatherEl);
    searchResults.appendChild(cityMainTempEl);
    searchResults.appendChild(cityMainHumidEl);
    searchResults.appendChild(cityMainWindSpdEl);


}