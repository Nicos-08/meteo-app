const APIKEY = "14bed691baf9e6c7c5dcac25111ee35f";

// Initialisation avec une ville de départ
let defaultCity = "Paris";
searchWeather(defaultCity);
document.querySelector("#city").value = ""

/* Afficher la date actuelle */

function refreshDate() {
    let d = new Date;
    
    let dayName = getRealDay(d.getDay());
    let dateNb = d.getDate();
    let month = getRealMonth(d.getMonth() + 1);
    
    let hours = d.getHours();
    let minutes = d.getMinutes();
    
    
    let dateElHtml = document.getElementById("current_weather__date");
    dateElHtml.innerText = `${defaultCity} : ${dayName} ${dateNb} ${month} à ${hours}h${minutes}`
}

refreshDate();


// Convertir le num de jour de la semaine en nom du jour de la semaine

function getRealDay(day) {
    if(day===1) {return "Lundi"} else
    if(day===2) {return "Mardi"} else
    if(day===3) {return "Mercredi"} else
    if(day===4) {return "Jeudi"} else
    if(day===5) {return "Vendredi"} else
    if(day===6) {return "Samedi"} else
    if(day===7) {return "Dimanche"} else
    {return "Erreur nom jour"}
}

// Convertir le num de mois en nom du mois

function getRealMonth(month) {
    if(month===1) {return "Janvier"} else
    if(month===2) {return "Février"} else
    if(month===3) {return "Mars"} else
    if(month===4) {return "Avril"} else
    if(month===5) {return "Mai"} else
    if(month===6) {return "Juin"} else
    if(month===7) {return "Juillet"} else
    if(month===8) {return "Août"} else
    if(month===9) {return "Septembre"} else
    if(month===10) {return "Octobre"} else
    if(month===11) {return "Novembre"} else
    if(month===12) {return "Décembre"} else
    {return "Erreur mois"}
}




// Fonctions appelées en onclick

function validation() {
    let city = document.getElementById("city").value;

    document.getElementById('errorName').style.display = "none";
    document.getElementById('error').style.display = "none";
    document.querySelector('.current_weather').style.display = "block";
    document.querySelector('.forecasts').style.display = "flex";
    document.querySelector('.forecasts__text').style.display = "block";

    if (city === "") {
        document.getElementById('error').style.display = "flex";
        document.querySelector('.current_weather').style.display = "none";
        document.querySelector('.forecasts').style.display = "none";
        document.querySelector('.forecasts__text').style.display = "none";
    } else {
        searchWeather(city);
        
        let d = new Date;
        
        let dayName = getRealDay(d.getDay());
        let dateNb = d.getDate();
        let month = getRealMonth(d.getMonth() + 1);
        
        let hours = d.getHours();
        let minutes = d.getMinutes().toString();
        if (minutes.length === 1) {
            minutes = "0" + minutes
        }
        
        let dateElHtml = document.getElementById("current_weather__date");
        dateElHtml.innerText = `${document.getElementById("city").value} : ${dayName} ${dateNb} ${month} à ${hours}h${minutes}`
    }

}

function searchWeather(city) {
    let urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&lang=fr&units=metric`;
    let urlForecasts = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKEY}&lang=fr&units=metric`
    
    fetch(urlCurrentWeather).then((response) =>
        response.json().then((data) => {
            if (data.cod === "404") {
                document.getElementById('errorName').style.display = "flex";
                document.querySelector('.current_weather').style.display = "none";
                document.querySelector('.forecasts').style.display = "none";
                document.querySelector('.forecasts__text').style.display = "none";
            }
            document.querySelector(".current_weather__informations__sun__icon").src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
            document.querySelector(".current_weather__informations__sun__description").innerText = data.weather[0].description;
            document.querySelector(".current_weather__informations__temperature__number").innerText = Math.round(data.main.temp) + "°";
            document.querySelector(".current_weather__informations__temperature__number").style.color = setTempColor(data.main.temp);
            document.querySelector(".current_weather__informations__wind_speed__number").innerText = Math.round(data.wind.speed * 3.6) + "km/h";
            document.querySelector(".current_weather__informations__wind_speed__number").style.color = setWindSpeedColor(data.wind.speed);
            document.querySelector(".current_weather__informations__humidity__number").innerText = Math.round(data.main.humidity) + "%";
            document.querySelector(".current_weather__informations__humidity__number").style.color = setHumidityColor(data.main.humidity);
        })
    )

    fetch(urlForecasts).then((response) =>
    response.json().then((data) => {
        console.log(data);
        const forecastsContainer = document.querySelector(".forecasts");
        forecastsContainer.innerHTML = "";

        let counter = 0;

        for (const item of data.list) {
            if (counter % 2 === 0) { 
                const forecastCard = `
                    <div class="forecasts__card">
                        <h3>${forecastsFindDate(item)}</h3>
                        <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png">
                        <h4 style="color: ${setTempColor(item.main.temp)}">${Math.round(item.main.temp)}°</h4>
                    </div>
                `;
                forecastsContainer.insertAdjacentHTML("beforeend", forecastCard);
            }
            
            counter++;
        }

    })
);

}


function forecastsFindDate(item) {
    let monthNb = parseInt(item.dt_txt.slice(5, 7));
    let day = item.dt_txt.slice(8, 10);
    let hour = item.dt_txt.slice(11, 13);
    return `${day} ${getRealMonth(monthNb)} ${hour}h`;
}


// Appeller aussi la fonction en appuyant sur Entrer

document.addEventListener("keydown", (touche) => {
    const valeur = touche.keyCode.toString();
    if (valeur === "13") {
        validation()
    }
})


function setTempColor(temp) {
    if (temp < 0) {
        return "#34E2EB"
    } else if (temp < 10) {
        return "#3983EB"
    } else if (temp < 20) {
        return "#EBE79E"
    } else if (temp < 30) {
        return "#F5671C"
    } else if (temp < 40) {
        return "#C20E11"
    } else {
        return "#B30009"
    }
}

function setWindSpeedColor(windSpeed) {
    if (windSpeed < 20) {
        return "#34E2EB"
    } else if (windSpeed < 40) {
        return "#3983EB"
    } else if (windSpeed < 60) {
        return "#EBE79E"
    } else if (windSpeed < 80) {
        return "#F5671C"
    } else if (windSpeed < 100) {
        return "#C20E11"
    } else {
        return "#B30009"
    }
}

function setHumidityColor(humidity) {
    if (humidity > 80) {
        return "#34E2EB"
    } else if (humidity > 60) {
        return "#3983EB"
    } else if (humidity > 40) {
        return "#EBE79E"
    } else if (humidity > 20) {
        return "#F5671C"
    } else if (humidity > 0) {
        return "#C20E11"
    } else {
        return "#B30009"
    }
}