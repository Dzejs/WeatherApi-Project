
let registerEventListenersService = {
    search: document.getElementById("search"),
    btn: document.getElementById("btn"),
    li: document.getElementsByClassName("nav-item"),
    pages: document.getElementById("pages").children,
    activeItems: (navItem) => {
        for (let item of registerEventListenersService.li) {
            item.classList.remove("active");
        }
        navItem.classList.add("active");
    },

    showPages: (showActivePage) => {

        for (let page of registerEventListenersService.pages) {
            page.style.display = "none";
        }
        showActivePage.style.display = "block";
    },
    defaultPage: () => {
        registerEventListenersService.pages[1].style.display = "none";
        registerEventListenersService.pages[2].style.display = "none";
    },
    registerListeners: () => {
        registerEventListenersService.defaultPage();
        registerEventListenersService.btn.addEventListener("click", () => {
            weatherApiService.city = registerEventListenersService.search.value;

            if (isNaN(weatherApiService.city)) {
                apiCallLimiter.setLimiter(5);
                apiCallLimiter.shouldBlock
                    ? alert("The limit is exceeded!")
                    : weatherApiService.callApi();
            }
            else {
                alert("Invalid input TRY AGAIN!");
            }

        });
        for (let i = 0; i < registerEventListenersService.li.length; i++) {
            registerEventListenersService.li[i].addEventListener("click", () => {
                registerEventListenersService.activeItems(registerEventListenersService.li[i]);
                registerEventListenersService.showPages(registerEventListenersService.pages[i]);
            });
        }
    }
}

let apiCallLimiter = {
    shouldBlock: false,
    apiCallsCounter: 0,
    currentMinute: new Date().getMinutes(),
    setLimiter: (callsPerMinute) => {
        if (apiCallLimiter.currentMinute === new Date().getMinutes()) {
            if (apiCallLimiter.apiCallsCounter > callsPerMinute) {
                apiCallLimiter.shouldBlock = true;
            }
            else {
                apiCallLimiter.shouldBlock = false;
            }
        }
        else {
            apiCallLimiter.apiCallsCounter = 0;
            apiCallLimiter.currentMinute = new Date().getMinutes();
            apiCallLimiter.shouldBlock = false;
        }
    }
}


let weatherApiService = {
    apiKey: `a2585cd30821df06e06d547cf09db342`,
    city: "Skopje",
    cashedData: null,
    callApi: () => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${weatherApiService.city}&units=metric&APPID=${weatherApiService.apiKey}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                apiCallLimiter.apiCallsCounter++;
                weatherApiService.cashedData = data;
                console.log(weatherApiService.cashedData);
                uiService.hourlyCity.innerHTML = data.city.name;
                uiService.weatherStatistics(data);
                uiService.hourlyWeatherLoader(data, pagingService.from, pagingService.to);
                pagingService.setTotalPages(data.list);
                pagingService.createPaggingButtons();

            })
            .catch(error => {
                uiService.hourlyWeather.innerHTML = `
                <img src="error.png" alt="error-msg" class="center"> 
                `;
                uiService.weatherStat.innerHTML = ` 
                <img src="error.png" alt="error-msg" class="center"> 
                `
                uiService.headerHourly.style.display = "none";
                uiService.descriptionHourly.style.display = "none";
                pagingService.prevButton.style.display = "none";
                pagingService.nextButton.style.display = "none";
                pagingService.paggingButtonsContainer.style.display = "none";
                pagingService.currentPageContainer.style.display = "none";
            })
    },
    cashedDataLoader: () => {
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getSortedData: () => {
        let sortedDescriptionArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.weather[0].description > s.weather[0].description) return 1
            else if (f.weather[0].description < s.weather[0].description) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedDescriptionArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getSortedTimeData: () => {
        let sortedTimeArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.dt_txt < s.dt_txt) return 1
            else if (f.dt_txt > s.dt_txt) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedTimeArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLargerSortedTempData: () => {
        let sortedLargerTempArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.main.temp < s.main.temp) return 1
            else if (f.main.temp > s.main.temp) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLargerTempArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLowerSortedTempData: () => {
        let sortedLowerTempArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.main.temp > s.main.temp) return 1
            else if (f.main.temp < s.main.temp) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLowerTempArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLargerSortedHumidity: () => {
        let sortedLargerHumiArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.main.humidity < s.main.humidity) return 1
            else if (f.main.humidity > s.main.humidity) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLargerHumiArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLowerSortedHumidity: () => {
        let sortedLowerHumiArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.main.humidity > s.main.humidity) return 1
            else if (f.main.humidity < s.main.humidity) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLowerHumiArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLargerWindSpeed: () => {
        let sortedLargerWindArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.wind.speed < s.wind.speed) return 1
            else if (f.wind.speed > s.wind.speed) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLargerWindArr
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    },
    getLowerWindSpeed: () => {
        let sortedLowerWindArr = weatherApiService.cashedData.list.sort((f, s) => {
            if (f.wind.speed > s.wind.speed) return 1
            else if (f.wind.speed < s.wind.speed) return -1
            else return 0;
        });
        weatherApiService.cashedData.list = sortedLowerWindArr;
        uiService.hourlyWeatherLoader(weatherApiService.cashedData, pagingService.from, pagingService.to);
    }

}

let uiService = {
    headerHourly: document.getElementById("header-hourly"),
    descriptionHourly: document.getElementById("description-hourly"),
    hourlyCity: document.getElementById("hourly-city"),
    weatherStat: document.getElementById("weather-stat"),
    hourlyWeather: document.getElementById("hourly-weather-table"),
    about: document.getElementById("about"),
    weatherStatistics: (data) => {
        uiService.weatherStat.innerHTML = `
        <div class="statistic-header mt-5">
            <h1>WeatherAlert - <span class="capital">${weatherApiService.city.charAt(0).toUpperCase() + weatherApiService.city.slice(1)}</span></h1>
            <h4>The most accurate weather page in the world!According to some sources...</h4>
        </div>
        `;
        let maxTempArr = [];
        let minTempArr = [];
        let averageArr = [];
        let humidityArr = [];


        for (let reading of data.list) {
            maxTempArr.push(reading.main.temp_max);
            minTempArr.push(reading.main.temp_min);
            averageArr.push(reading.main.temp);
            humidityArr.push(reading.main.humidity);
        }

        console.log(minTempArr);
        console.log(maxTempArr);
        console.log(averageArr);

        let maxTempResult = maxTempArr[0];
        let minTempResult = minTempArr[0];
        let averageTempResult = 0;
        let maxIndex = 0;
        let minIndex = 0;
        let dateMax = "";
        let dateMin = "";
        for (let number of maxTempArr) {
            if (number > maxTempResult) {
                maxTempResult = number;
                maxIndex = maxTempArr.indexOf(maxTempResult);
            }
        }
        for (let number of minTempArr) {
            if (number < minTempResult) {
                minTempResult = number;
                minIndex = minTempArr.indexOf(minTempResult);
            }
        }
        for (let reading of data.list) {
            dateMax = data.list[maxIndex].dt_txt;
            dateMin = data.list[minIndex].dt_txt;
        }
        console.log(dateMax);
        console.log(dateMin);
        for (let number of averageArr) {
            averageTempResult += number;
        }
        averageTempResult /= averageArr.length;

        let maxHumidity = humidityArr[0];
        let minHumidity = humidityArr[0];
        let averageHumidity = 0;

        for (let number of humidityArr) {
            if (maxHumidity < number) {
                maxHumidity = number;
            }
            if (minHumidity > number) {
                minHumidity = number;
            }
            averageHumidity += number;
        }
        averageHumidity /= humidityArr.length;

        uiService.weatherStat.innerHTML += `
       <div class="row temp-row mt-5">
        <div class="col-md-3"></div>
        <div class="col-md-2">
            <div>MAX TEMP: ${maxTempResult}</div>
            <div>MIN TEMP: ${minTempResult}</div>
            <div>AVERAGE TEMP: ${Math.round(averageTempResult)}</div>
        </div>
        <div class="col-md-2"></div>
        <div class="col-md-3">
            <div>MAX Humidity: ${maxHumidity}</div>
            <div>MIN Humidity: ${minHumidity}</div>
            <div>AVERAGE Humidity: ${Math.round(averageHumidity)}</div>
        </div>
       </div>
       <div class="row statistic-header mt-5  justify-content-center">
            <div>
                <h2>Warmest time of the following period: ${dateMax}</h2>
                <h2>Coldest time of the following period: ${dateMin}</h2>
            </div>
       </div>
       `
    },
    hourlyWeatherLoader: (data, from = 0, to = 10) => {
        uiService.hourlyWeather.innerHTML = "";
        for (let i = from; i < to; i++) {
            uiService.hourlyWeather.innerHTML += `
            <div class="row statistic-header mt-2 h-flex bg-color text-dark">
                <div class="col-md-2">
                    <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">
                </div>
                <div class="col-md-2">${data.list[i].weather[0].description}</div>
                <div class="col-md-2">${data.list[i].dt_txt}</div>
                <div class="col-md-2">${data.list[i].main.temp}</div>
                <div class="col-md-2">${data.list[i].main.humidity}</div>
                <div class="col-md-2">${data.list[i].wind.speed}</div>
            </div>
            `
        }
    }
}

let pagingService = {
    prevButton: document.getElementById("previousPageButton"),
    nextButton: document.getElementById("nextPageButton"),
    paggingButtonsContainer: document.getElementById("paggingButtons"),
    currentPageContainer: document.getElementById("currentPage"),
    from: 0,
    to: 10,
    page: 1,
    totalPages: 0,

    registerPagingListeners: () => {
        pagingService.prevButton.addEventListener("click", () => {
            if (pagingService.page > 1) {
                pagingService.from -= 10;
                pagingService.to -= 10;
                pagingService.page--;
            }
            pagingService.adaptPageButtons();
            weatherApiService.cashedDataLoader();
        })
        pagingService.nextButton.addEventListener("click", () => {
            if (pagingService.page < pagingService.totalPages) {
                pagingService.from += 10;
                pagingService.to += 10;
                pagingService.page++;
            }
            pagingService.adaptPageButtons();
            weatherApiService.cashedDataLoader();
        })
    },
    adaptPageButtons: () => {
        if (pagingService.page <= 1) {
            pagingService.prevButton.style.display = "none";
        }
        else {
            pagingService.prevButton.style.display = "inline";
        }
        if (pagingService.page >= pagingService.totalPages) {
            pagingService.nextButton.style.display = "none";
        }
        else {
            pagingService.nextButton.style.display = "inline";
        }
        pagingService.currentPageContainer.innerHTML = `<p>current page - ${pagingService.page}</p>`
    },
    setTotalPages: (list) => {
        pagingService.totalPages = Math.ceil(list.length) / 10;
    },
    createPaggingButtons: () => {
        pagingService.paggingButtonsContainer.innerHTML = "";

        for (let i = 0; i < pagingService.totalPages; i++) {
            pagingService.paggingButtonsContainer.innerHTML += `
                <button class="btn bg-primary mt-3" id="page${i + 1}">${i + 1}</button>
            `;
        }

        for (let i = 0; i < pagingService.totalPages; i++) {
            document.getElementById(`page${i + 1}`).addEventListener("click", () => {
                console.log("asads")
                pagingService.from = i * 10;
                pagingService.to = (i + 1) * 10;
                pagingService.page = i + 1;
                pagingService.adaptPageButtons();
                weatherApiService.cashedDataLoader();
            })
        }
    }
}
let sortService = {
    descriptionSort: document.getElementById("down-arrow-description-sort"),
    timeSort: document.getElementById("up-arrow-time-sort"),
    largerTemp: document.getElementById("up-arrow-temp-sort"),
    lowerTemp: document.getElementById("down-arrow-temp-sort"),
    largerHumidity: document.getElementById("up-arrow-humi-sort"),
    lowerHumidity: document.getElementById("down-arrow-humi-sort"),
    largerWind: document.getElementById("up-arrow-wind-sort"),
    lowerWind: document.getElementById("down-arrow-wind-sort"),


    sortingListeners: () => {
        sortService.descriptionSort.addEventListener("click", () => {
            weatherApiService.getSortedData();
        });
        sortService.timeSort.addEventListener("click", () => {
            weatherApiService.getSortedTimeData();
        });
        sortService.largerTemp.addEventListener("click", () => {
            weatherApiService.getLargerSortedTempData();
        });
        sortService.lowerTemp.addEventListener("click", () => {
            weatherApiService.getLowerSortedTempData();
        });
        sortService.largerHumidity.addEventListener("click", () => {
            weatherApiService.getLargerSortedHumidity();
        });
        sortService.lowerHumidity.addEventListener("click", () => {
            weatherApiService.getLowerSortedHumidity();
        });
        sortService.largerWind.addEventListener("click", () => {
            weatherApiService.getLargerWindSpeed();
        });
        sortService.lowerWind.addEventListener("click", () => {
            weatherApiService.getLowerWindSpeed();
        });
    }
}





registerEventListenersService.registerListeners();

pagingService.registerPagingListeners();

weatherApiService.callApi();

sortService.sortingListeners();


