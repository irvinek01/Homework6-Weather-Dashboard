var form = document.querySelector("#form");
var searchCity = document.querySelector("#searchCity");
var searchResults = document.querySelector("#searchResults");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    var weatherAPIURL = "https://api.openweathermap.org/data/2.5/weather?q=" + "San Diego" + "&units=imperial&appid=d87a354ef5592a59d3994382f76cd854";
    // var fiveDaywithUVIndex = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&appid=d87a354ef5592a59d3994382f76cd854";
    // Promise.all([
    //     fetch(weatherAPIURL),
    //     fetch(iconAPIURL),
    // ])
    //     .then(function (responses) {
    //         return Promise.all(responses.map(function (response) {
    //             return response.json();
    //         }));
    //     }).then(function (data) {
    //         console.log(data);
    //         printWeatherForecast(data);
    //     }).catch(function (error) {
    //         console.log(error);
    //     });
    fetch(weatherAPIURL)
        .then(function (response) {
            if (response.status === 404) {
                alert("Cannot find " + searchCity.value);
            } else if (response.status === 400) {
                alert("You did not enter any!");
            }
            return response.json();
        })
        .then(function (weatherAPIURLdataObj) {
            console.log(weatherAPIURLdataObj);
            printWeatherForecast(weatherAPIURLdataObj);
        });
})

var printWeatherForecast = function (results) {
    searchResults.innerHTML = "";
    cityMainWeatherEl = document.createElement("h3");
    cityMainWeatherElIcon = document.createElement("img");
    cityMainTempEl = document.createElement("p");
    cityMainHumidEl = document.createElement("p");
    cityMainWindSpdEl = document.createElement("p");

    cityMainWeatherEl.textContent = results.name + " ("+(moment.unix(results.dt).format("MMM DD YYYY"))+")";
    cityMainWeatherElIcon.src = "http://openweathermap.org/img/wn/" + results.weather[0].icon + "@2x.png";
    cityMainWeatherElIcon.width, cityMainWeatherElIcon.height  = "35";

    cityMainTempEl.textContent = "Temperature: " + results.main.temp;
    cityMainHumidEl.textContent = "Humidity Percentage: " + results.main.humidity + "%";
    cityMainWindSpdEl.textContent = "Wind Speed: " + results.wind.speed;
    
    searchResults.appendChild(cityMainWeatherEl);
    cityMainWeatherEl.appendChild(cityMainWeatherElIcon);

    searchResults.appendChild(cityMainTempEl);
    searchResults.appendChild(cityMainHumidEl);
    searchResults.appendChild(cityMainWindSpdEl);
}

// var weatherForecast5Day = function (results) {
//     oneCallAPI = "https://api.openweathermap.org/data/2.5/onecall?lat="{lat}"&lon="{lon}"&appid=d87a354ef5592a59d3994382f76cd854"
// }