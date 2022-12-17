let map=null,
marker=null;
let weather = {
  apiKey: "2a6de1771bc27a3bc79cbf0007c5b959",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { country } = data.sys;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { all } = data.clouds;
    const { lat, lon} = data.coord;
    document.querySelector(".city").innerText = "City: " + name + "," + country;
    document.querySelector(".icon").src = 
      "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector(".description").innerText =  "Conditions: " + description;
    document.querySelector(".temp").innerText = "Temperature: " + temp + "°C";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
      document.querySelector(".humidity").innerText =
    "Humidity: " + humidity + "%";
    document.querySelector(".clouds").innerText = "Clouds: " + all + "%";
    document.querySelector(".geo-coordinates").innerText = "Geo Coordinates: " + lat + ", " + lon;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
} else {
  alert("Geolocation is not supported by this browser.");
}

function Api(lat, long) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon="+long+"&units=metric&appid=" +
      weather.apiKey
  )
    .then((response) => {
      if (!response.ok) {
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      return response.json();
    })
    .then((data) => weather.displayWeather(data));
  
}

function showPosition(position) {
  let lat=position.coords.latitude;
  let long=position.coords.longitude;
  generateMap(lat,long);
  console.log(lat,long,weather.apiKey);
  Api(lat, long);
}


  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });
  
  weather.fetchWeather("Bali");
  
  function searchBar() {
    weather.search();
  }

  function generateMap(lat,long) {
    
    if(!map) {
      // Initialize the map and assign it to a variable for later use
      // there's a few ways to declare a VARIABLE in javascript.
      // you might also see people declaring variables using `const` and `let`
      map = L.map('map', {
      // Set latitude and longitude of the map center (required)
      center: [lat, long],
      // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
      zoom: 11
      });

    }else{
      console.log(lat,long);
      map.removeLayer(marker);
      map.setView([lat,long],11);
    }
    

  // Create a Tile Layer and add it to the map
  var tiles = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  minZoom: '8'}).addTo(map);

  marker = L.marker(
  [lat, long],
  { 
    draggable: true,
    title: "",
    opacity: 0.75
  });


  marker.addTo(map);

  marker.on("dragend",function(e){
    lat=e.target._latlng.lat;
    long=e.target._latlng.lng;
    generateMap(lat,long);
    Api(lat, long);
  })
}