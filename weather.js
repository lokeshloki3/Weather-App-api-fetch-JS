const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');

let oldTab = userTab;
oldTab.classList.add('current-tab');
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
searchForm.classList.add('hide');
loadingScreen.classList.add("hide");
userInfoContainer.classList.add("hide");
// Check initially coordinates are present or not
getfromSessionStorage();

function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove('current-tab');
        oldTab = newTab;
        oldTab.classList.add('current-tab');

        if(!searchForm.classList.contains('attapattu')){
            userInfoContainer.classList.add("hide");
            grantAccessContainer.classList.add("hide");
            searchForm.classList.add('attapattu');
            searchForm.classList.remove('hide');
        }
        else{
            searchForm.classList.remove('attapattu');
            userInfoContainer.classList.add("hide");
            searchForm.classList.add('hide');
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () =>{
    switchTab(userTab);
})

searchTab.addEventListener('click', () =>{
    switchTab(searchTab);
})

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAccessContainer.classList.remove('hide');
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.add('hide');
    loadingScreen.classList.remove("hide");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.add("hide");
        userInfoContainer.classList.remove('hide');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.add("hide");
        console.log(err);
    }
}


async function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// If localCoordinates not present
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("alert for no gelolocation support available");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// Get value of city in search bar
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

// function searchWeather() {
//     const inputValue = document.getElementById("weather-input");
//     const inputCity = inputValue.value;
//     console.log("Getting weather for " + inputCity);
//     fetchSearchWeatherInfo(inputCity);
// }

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.remove("hide");
    userInfoContainer.classList.add('hide');
    grantAccessContainer.classList.add('hide');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.add("hide");
        userInfoContainer.classList.remove('hide');
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log("Error found", err);
    }
}