// Local Variables
var current = document.querySelector('cityTarget');
var forecast = document.querySelector('cityInfo');
var history = document.querySelector('citiesHistory');
var button = document.querySelector('searchButton');

var weatherConditions = [];
var dataStore = JSON.parse(localStorage.getItem('cities')) || [];

var APIKey = 'dddc6c260b60f639e36dd929a5489bd9';

var clearElement = function(element) {

    element.innerHTML = '';

};

var callFetchAPI = function(city) {

    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)
        .then

};

var cityLoad = function() {

    clearElement(history);

    if(dataStore) {

        var ulElement = document.createElement('ul');
        ulElement.classListadd('w-100');
        ulElement.classListadd('list-unstyled');

        for(let i = 0; i < dataStore.length; i++) {

            var liElement = document.createElement('li');
            liElement.innerHTML = "<button type='button' class='list-group-item list-group-item-action' attr='"+dataStore[i]+"'>" + dataStore[i] + "</button>";
            ulElement.appendChild(liElement);

        }

        history.appendChild(ulElement);

    }

};

var citySave = function(city){

    var flag = false;

    if(dataStore){

        for(let i = 0; i < dataStore.length; i++){

            if(dataStore[i] === city){

                flag = true;

            }

        }

        if(flag){

            displayAlertMessage("The City: "+city+" already exists")

        }
    }

    if(!flag){

        dataStore.push(city);
        localStorage.setItem("cities",JSON.stringify(dataStore));

    }
    
    cityLoad();

}

var search = function(event) {

    event.preventDefault();

    var inputElement = document.querySelector('citySearch');
    var inputText = inputElement.value.trim();

    if(inputElement.value === '') {
        //modal goes here
        return;
    }

    callFetchAPI(inputText); //TODO define function

};

button.addEventListener('click', search)