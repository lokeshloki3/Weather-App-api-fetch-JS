const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const notFoundImg = document.querySelector(".not-found");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchInput = document.querySelector("[data-searchInput]");

// ELEMENTS FOR RENDER WEATHER INFORMATION FUNCTION
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");
const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed = document.querySelector("[data-windspeed]");
const humidity = document.querySelector("[data-humidity]");
const cloudiness = document.querySelector("[data-cloudiness]");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();


// THIS FUNCTION HELPS IN CHANGING CSS PROPERTY WHEN TAB IS SWITCHED
function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //IS SEARCH FORM CONTAINER INVISIBLE, IF YES THEN MAKE IT VISIBLE
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //TO MAKE YOUR WEATHER TAB VISIBLE
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //CHECKING LOCAL STORAGE FOR CO-ORDINATES
            getfromSessionStorage();
        }
    }
}


// THESE EVENT LISTENERS CHECK FOR CLICK ON TABS
userTab.addEventListener("click", () => {
    //PASS CLICKED TAB AS INPUT PARAMETER
    resetView();
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    //PASS CLICKED TAB AS INPUT PARAMETER
    resetView();
    switchTab(searchTab);
});

function resetView() {
    notFoundImg.classList.remove("active");
    searchInput.value = '';
}


//CHECK IF CO-ORDINATES ARE ALREADY PRESENT IN SESSION STORAGE
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //IF LOCAL CO-ORDINATES ARE NOT FOUND
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}


// HELPS TO FETCH THE USER WEATHER INFO USING USER'S LIVE CO-ORDINATES
async function fetchUserWeatherInfo(coordinates) {

    const {lat, lon} = coordinates;

    //MAKE GRANT-CONTAINER INVISIBLE 
    grantAccessContainer.classList.remove("active");

    //MAKE LOADER VISIBLE 
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        userContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFoundImg.classList.add("active");
    }

}


//TO FETCH VALUES FROM WEATHER INFO OBJECT AND PUT IT IN UI ELEMENTS
function renderWeatherInfo(weatherInfo) {

    console.log(weatherInfo);

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}


// HELPS TO FIND THE LIVE CO-ORDINATES OF THE USER
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
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


// WORKING OF THE GRANT ACCESS BUTTON
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


// WORKING OF THE SEARCH FORM
searchForm.addEventListener("submit", (e) => {

    e.preventDefault();
    let cityName = searchInput.value;
    resetView();

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})


// FETCHING DATA FOR THE INPUT IN SEARCH FORM
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log('inside error not found');
        loadingScreen.classList.remove("active");
        userContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFoundImg.classList.add("active");
    }
}
