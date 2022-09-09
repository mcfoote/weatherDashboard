// Local Variables
var current = document.querySelector("#cityTarget");
var forecast = document.querySelector("#cityInfo");
var historyContainer = document.querySelector("#citiesHistory");
var button = document.querySelector("#searchButton");

//arrays for weather conditions and local storage objects
var weatherCondition = [];
var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

var urlIcon = 'http://openweathermap.org/img/wn/';

// Authentication Key
var APIKey = 'dddc6c260b60f639e36dd929a5489bd9';

// clear elements within container
var clearElement = function(element) {

    element.innerHTML = '';

};

// Function to grab weather data from open weather API
var callFetchAPI = function(city) {

    var url = 'http://api.openweathermap.org/data/2.5/forecast?units=imperial&q='+city + "&appid=" + APIKey;

    fetch(url)
    .then(function(weatherResponse) {
        return weatherResponse.json();
     })
    .then(function(weatherResponse) {

        if (weatherResponse.cod != '200') {
            
            alert('Unable to find '+ city +' in OpenWeathermap.org');

            return;
        }else {
                
                createDataObject(weatherResponse.list, weatherResponse.city.coord);

        }

        var url1 = 'http://api.openweathermap.org/data/2.5/uvi?lat='+weatherCondition[0].lat+'&lon='+weatherCondition[0].lon + "&appid=" + APIKey;
        
        fetch(url1)

        .then(function(uvResponse) {
          return uvResponse.json();
        })
        .then(function(uvResponse) {

          if (!uvResponse) {  
            alert('OpenWeathermap.org could not find anything for latitude and Longitude');

            return;
          } else {

            citySave(city);

            weatherHTML(city, uvResponse.value);
          }

        })
    })
        .catch(function(error) {
            
            alert('Unable to connect to OpenWeathermap.org');
            return;

        });
};

//Load cities from local storage
var cityLoad = function() {

    clearElement(historyContainer);

    if(dataStore) {
            
        var ulElement = document.createElement('ul');
        ulElement.classList.add('list-unstyled');
        ulElement.classList.add('w-100');
            
            
        for(let i = 0; i < dataStore.length; i++) {
                
            var liElement = document.createElement('li');
            liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='" + dataStore[i]+"'>" + dataStore[i] + "</button>";
            ulElement.appendChild(liElement);

        }

        historyContainer.appendChild(ulElement); 

    }
};

//Save cities to local storage
var citySave = function(city) {

    var flag = false;

    if(dataStore) {

        for(let i = 0; i < dataStore.length; i++) {

            if(dataStore[i] === city) {
                flag = true;
            }

        }

    }

    if(!flag) {

        dataStore.push(city);
        localStorage.setItem('cities',JSON.stringify(dataStore));

    }
    
    cityLoad();

};

//Search button function implementation
var search = function(event) {

    event.preventDefault();

    var inputElement = document.querySelector('#citySearch');
    var textInput = inputElement.value.trim();

    if(inputElement.value === '') {

        alert('Weather Dashbord\n   You must enter a City');
        return;

    }else {
   
        callFetchAPI(textInput);

    }
     
    

};

//Searched City listener to bring up previously searched cities info
$(document).on('click', '.list-group-item', function(event) {

    event.preventDefault();

    var city = $(this).attr('attr');
    callFetchAPI(city);

});

//Get uv index data and assign color
var getUV = function(uv) {

    var indexUV = parseFloat(uv);
    var bgColor;                            
    
    if(indexUV < 3){
        bgColor = 'bg-success';            
    }else if( indexUV < 6) {
        bgColor = 'bg-warning';        
    }else if(indexUV < 8) {
        bgColor = 'bg-danger';      
    }else {
        bgColor = 'bg-dark';    
    }
     
    return bgColor;

};

//Function to display weather condition info in html page
var weatherHTML = function (city, uv) {

    clearElement(current);
    clearElement(forecast); 

    var ctn1 = document.createElement('div');                          
    ctn1.classList.add('col-6');                                       
    var ctn2 = document.createElement('div');                          
    ctn2.classList.add('col-6');                                       

    var cityEl = document.createElement('h2');
    var imageCurrent = document.createElement('img');

    cityEl.textContent = city + ' (' + weatherCondition[0].dateT +')';
    imageCurrent.setAttribute('src', weatherCondition[0].icon);                           
    imageCurrent.classList.add('bg-info');

    ctn1.appendChild(cityEl);
    ctn2.appendChild(imageCurrent);

    var ctn3  = document.createElement('div');                          
    ctn3.classList.add('col-12');
                           
    ctn3.innerHTML = '<p>Temp: ' + weatherCondition[0].temp + ' °F' + '</p>' +
                     '<p>Wind: ' + weatherCondition[0].speed + ' MPH' + '</p>' +
                     '<p>Humidity: ' + weatherCondition[0].humidity + '% </p>' +
                     "<p>UV index: <span class='text-white "+ getUV(uv) + "'>" + uv + '</span></p>';

    current.appendChild(ctn1);
    current.appendChild(ctn2);
    current.appendChild(ctn3);

    var ctn6 = document.createElement('div');         
    ctn6.classList.add('row');                        
    var ctn7 = document.createElement('div');

    ctn7.classList.add('col-12');                     
    ctn7.innerHTML = '<h2>5-Day Forecast: </h2>';
    ctn6.appendChild(ctn7);
    forecast.appendChild(ctn6);

    var ctn8 = document.createElement('div');         
    ctn8.classList.add('d-flex');                     

    for(var i=1; i<weatherCondition.length; i++) {    
        
        var ctn4  = document.createElement('div');  

        ctn4.classList.add('card');                    
        ctn4.classList.add('bg-primary');              
        ctn4.classList.add('text-white');               
        ctn4.classList.add('rounded');                  
        ctn4.classList.add('mr-2');                     
        ctn4.classList.add('flex-fill')

        var ctn5  = document.createElement('div'); 
        ctn5.classList.add('card-body');
        var title = document.createElement('h6');
        title.classList.add('card-title');
        var imageForecast = document.createElement('img');
        title.textContent = weatherCondition[i].dateT;
        imageForecast.setAttribute('src', weatherCondition[i].icon);

        var pEl1 = document.createElement('p');
        var pEl2 = document.createElement('p');
        var pEl3 = document.createElement('p');
        
        pEl1.classList.add('small');
        pEl1.textContent = 'Temp: ' + weatherCondition[i].temp + ' °F';
        pEl2.classList.add('small');
        pEl2.textContent = 'Wind: ' + weatherCondition[i].speed + ' MPH';
        pEl3.classList.add('small');
        pEl3.textContent = 'Humidity: ' + weatherCondition[i].humidity + '%';

        ctn5.appendChild(title);
        ctn5.appendChild(imageForecast);
        ctn5.appendChild(pEl1);
        ctn5.appendChild(pEl2);
        ctn5.appendChild(pEl3);
        ctn4.appendChild(ctn5);        
        ctn8.appendChild(ctn4);

    }

    forecast.appendChild(ctn8);
    
};


var searchForDate = function (str) {

    var hour = str.split(' ')[1].split(':')[0];
    var flag = false;
    
    if(hour === '12') {
        flag = true;
    }        
    
    return flag;

};

// prepare date format for proper output
var formatDate = function(strDate) {

    var newDate = strDate.split(' ')[0].split('-');

    return (newDate[1]+'/'+newDate[2]+'/'+newDate[0]);

};

//Create array of objects from weather conditions
var createDataObject = function(list, position) {
    
    if(weatherCondition.length) weatherCondition = [];

    var obj = {

        dateT : formatDate(list[0].dt_txt),
        humidity : list[0].main.humidity,
        speed: list[0].wind.speed,
        temp: list[0].main.temp,
        icon : urlIcon + list[0].weather[0].icon + '.png',
        lat : position.lat,
        lon: position.lon

    };

    weatherCondition.push(obj);

    for(let i=1; i<list.length; i++) {

        if(searchForDate(list[i].dt_txt)) {

            obj = {

                dateT : formatDate(list[i].dt_txt),
                humidity : list[i].main.humidity,
                speed: list[i].wind.speed,
                temp: list[i].main.temp,
                icon : urlIcon + list[i].weather[0].icon + '.png',
                lat : position.lat,
                lon: position.lon

            };

            weatherCondition.push(obj);

        }
    }

};

//call load function
cityLoad();

//event listener for search button
button.addEventListener('click', search);